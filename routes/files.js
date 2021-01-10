const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

// Storage of file to Uploads
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // files name should be unique
    // Generated with using TimeStamp
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);

    // E.g 86586546498776-8765678865.zip
  }
});

let upload = multer({
  storage,
  limit: {
    fileSize: 1000000 * 100
  }
}).single("myfile");

router.post("/", (req, res) => {
  // Save to Uploads Folder => 2 Step

  upload(req, res, async err => {
    // VAlidate Request => 1 Step

    if (!req.file) {
      return res.json({ error: "All feilds are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // Store Data From Upload Folder to db => 3 Step

    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
    });
    // Eg http://localhost:3000/files/uuid
  });

  //   Send Response  | Download Link
});

// Router For Send File Through Email

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  // VAlidate Request;

  if (!uuid || !emailFrom || !emailFrom) {
    return res.status(422).send({ error: "All Fields are Required" });
  }

  // GEt data From Database;

  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.status(422).send({ error: "Email already Sent" });
  }

  file.sender = emailFrom;

  file.reciever = emailTo;

  const response = await file.save();

  // Send Email;
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "InShare File Sharing",
    text: `${emailFrom} share a file with you`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours"
    })
  });

  return res.send({ sucess: true });
});

module.exports = router;
