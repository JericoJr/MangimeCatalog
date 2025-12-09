const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", async (request, response) => {
    console.log("\nEntering myStuff Page");
    animeTable = await getTable("Anime");
    mangaTable = await getTable("Manga");
    response.render("myStuff", {animeTable: animeTable, mangaTable: mangaTable});
});

router.post("/deleteAll", async (request, response) => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        await mongoose.connection.db.dropCollection('animes');
        await mongoose.connection.db.dropCollection('mangas');
        console.log("\nDeleting All Content");

        mongoose.disconnect();

    } catch (err) {
      console.error(err);
    }
    response.render("myStuff");
});

async function getTable(type) {
    let idName;
    if (type === "Anime") {
        idName = "animeTable";
    } else {
        id = "mangaTable"
    }
    let table = `<table border="1" id="${idName}">`;
    table += `<tr> <th>Title</th> <th>Type</th> <th>Genre</th> <th>Status</th> <th>Rating</th> <th>Comments</th> </tr>`;
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        let collectionName = (type === "Anime" ? "animes":"mangas");
        const animeCollection = mongoose.connection.db.collection(collectionName);
        const animeData = await animeCollection.find({}).toArray();
        animeData.forEach( content => {
            table += `<tr> <th>${content.title}</th> <th>${content.type}</th> <th>${content.genre}</th> <th>${content.status}</th> <th>${content.rating}</th> <th>${content.comments}</th> </tr>`;
        });

        mongoose.disconnect();
    } catch (err) {
      console.error(err);
      table += `<tr> <td colspan="6">None</td> </tr>`;
    }
    table += `</table>`;
    return table;
}

module.exports = router; 