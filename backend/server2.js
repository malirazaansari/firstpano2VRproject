const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/yourDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const ImageSchema = new mongoose.Schema({
  imageName: String,
  timestamp: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", ImageSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/store-image", upload.single("image"), async (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageName = req.file.filename;
    const newImage = new Image({ imageName });
    await newImage.save();
    res.status(200).json({ message: "Image stored successfully", imageName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error storing image" });
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Image upload server is running!");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
