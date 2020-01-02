const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
app.use(cors());

app.use(express.static("upload"));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "upload");
  },

  filename: function(req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
          .trim() // remove whitespaces at the start and end of string
          .replace(ext, "")
          .toLowerCase()
          .replace(/^-+/g, "") // remove one or more dash at the start of the string
          .replace(/[^\w-]+/g, "-") // convert any on-alphanumeric character to a dash
          .replace(/-+/g, "-") // convert consecutive dashes to singuar one
          .replace(/-+$/g, "") +
        "." +
        ext
    );
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 50 } }).single("file");

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.listen(1234, function() {
  console.log("app runing on port 1234");
});
