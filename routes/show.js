const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  // Fetch the file which uuid matches with;

  try {
    const file = await File.findOne({
      uuid: req.params.uuid
    });

    // If Wrong dont Show Files

    if (!file) {
      return res.render("download", { error: "Linked has been expired" });
    }

    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` //download link
      //  http:localhost:3000/files/download/uuid;
    });
  } catch (error) {
    return res.render("download", { error: "Somwthing Wrong in Downloads" });
  }
});

module.exports = router;
