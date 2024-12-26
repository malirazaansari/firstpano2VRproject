const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/pano2vr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const choiceSchema = new mongoose.Schema({
  pictureName: String,
  clickedAt: { type: Date, default: Date.now },
});

const Choice = mongoose.model("Choice", choiceSchema);

app.post("/api/store-choice", async (req, res) => {
  const { pictureName } = req.body;

  if (!pictureName) {
    return res.status(400).send({ error: "Picture name is required" });
  }

  const choice = new Choice({ pictureName });
  await choice.save();

  res.send({ message: "Choice stored successfully", choice });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
