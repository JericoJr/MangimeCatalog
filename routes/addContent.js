const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

//Schema for Anime, Manga
const animeSchema = new mongoose.Schema({
  title: String,
  type: String,
  status: String,
  genre: [String],
  rating: Number,
  comments: String
});

const mangaSchema = new mongoose.Schema({
  title: String,
  type: String,
  status: String,
  genre: [String],
  rating: Number,
  comments: String
});

//Creates model only once, if exists using exisiting, otherwise create new one
const Anime = mongoose.models.Anime || mongoose.model("Anime", animeSchema);
const Manga = mongoose.models.Manga || mongoose.model("Manga", mangaSchema);

router.get("/", (request, response) => {
  console.log("\nEntering Form Page");
  let displayMessage;
  if (request.query.message) {
    displayMessage = JSON.parse(request.query.message);
  } else {
    displayMessage = null;
  }
  response.render("addContentForm", {message: displayMessage});
});

router.post("/submit", async (request, response) => {  
  console.log('POST request to /addContentForm/submit');
  let result = await addToDB(request);
  let message = ""; 
  if (result) {
    message += `<p class="succ-message">Item was Successfully Addded!</p>`;
  } else {
    message += `<p class="err-message">Error: Item was Not Successfully Added</p>`;
  }
  const messageEnc = encodeURIComponent(JSON.stringify(message));
  response.redirect(`/addContent?message=${messageEnc}`);
});

async function addToDB(request) {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
    if (request.body.type === "Anime") {
      await Anime.create({
        title: request.body.title,
        type: "Anime",
        status: request.body.status,
        genre: request.body.genre,
        rating: request.body.rating,
        comments: request.body.comments
      });
      console.log("\nAdded Anime to Database");
    } else {
      await Manga.create({
        title: request.body.title,
        type: "Manga",
        status: request.body.status,
        genre: request.body.genre,
        rating: request.body.rating,
        comments: request.body.comments
      }); 
      console.log("\nAdded Manga to Database");
    }
      mongoose.disconnect();
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

module.exports = router; 