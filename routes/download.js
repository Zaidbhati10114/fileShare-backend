const express = require("express").Router();

const File = require("../models/file");
const router = require("./files");

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });

  if (!file) {
    return res.render("download", { error: "Link Has Been Expired" });
  }

  const filePath = `${__dirname}/../${file.path}`;

  // Download file in Express;

  res.download(filePath);
});

module.exports = router;
