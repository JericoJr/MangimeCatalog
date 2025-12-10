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
    response.redirect("/myStuff");
});

async function getTable(type) {
    let idName;
    if (type === "Anime") {
        idName = "animeTable";
    } else {
        id = "mangaTable"
    }
    let table = `<table class="myStuffTable" id="${idName}">`;
    table += `<colgroup>
                <col style="width: 25%">   
                <col style="width: 4%">  
                <col style="width: 20%">   
                <col style="width: 10%">  
                <col style="width: 1%">
                <col style="width: 25%"> 
                <col style="width: 25%"> 
            </colgroup>`;
    table += `<thead> <tr> <th>Title</th> <th>Type</th> <th>Genre</th> <th>Status</th> <th>Rating</th> <th>Comments</th> <th></th></tr> <thead>`;
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        let collectionName = (type === "Anime" ? "animes":"mangas");
        const animeCollection = mongoose.connection.db.collection(collectionName);
        const animeData = await animeCollection.find({}).toArray();
        let tableEntries = "";
        animeData.forEach( content => {
            tableEntries += `<tr> <td>${content.title}</td> <td>${content.type}</td> <td>${content.genre}</td> <td>${content.status}</td> <td>${content.rating}</td> <td>${content.comments}</td> <th> <button>Edit</button> <button>Delete</button> </th> </tr>`;
        });
        if (tableEntries === "") {
            table += `<tbody class="myStuffTableBody"> <tr> <td colspan="7">None</td> </tr> </tbody>`;
        } else {
            table += `<tbody class="myStuffTableBody"> ${tableEntries} </tbody>`;
        }
        mongoose.disconnect();
    } catch (err) {
      console.error(err);
      table += `<tbody class="myStuffTableBody"> <tr> <td colspan="7">None</td> </tr> </tbody>`;
    }
    table += `</table>`;
    return table;
}

module.exports = router; 