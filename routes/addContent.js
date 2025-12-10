const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", (request, response) => {
    console.log("\nEntering Form Page");
    response.render("addContentForm", {message: null});
});


router.post("/submit", async (request, response) => {  
    console.log('POST request to /addContentForm/submit');
    let resultMessage = await addToDB(request);
    console.log(resultMessage)
    response.render("addContentForm", {message: resultMessage});
});


async function addToDB(request) {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
    
        if (request.body.type === "Anime") {
        const animeSchema = new mongoose.Schema({
            title: String,
            type: String,
            status: String,
            genre: [String],
            rating: Number,
            comments: String
        });

        const Anime = mongoose.model("Anime", animeSchema);

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
            const mangaSchema = new mongoose.Schema({
            title: String,
            type: String,
            status: String,
            genre: [String],
            rating: Number,
            comments: String
        });

        const Manga = mongoose.model("Manga", mangaSchema);

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
      return `<p class="err-message">Error: ${request.body.title} was Not Added to Database</p>`;
    }
    return `<p class="succ-message">"${request.body.title}" was Sucessfully Added to Database!</p>`;
}

module.exports = router; 