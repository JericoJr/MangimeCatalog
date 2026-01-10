const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", async (request, response) => {
    // console.log("Entering myStuff Page");
    let animeTable;
    let mangaTable;
    //Checks for already exisiting table parameters
    if (request.query.animeTable && request.query.mangaTable) {
        animeTable = JSON.parse(request.query.animeTable);
        mangaTable = JSON.parse(request.query.mangaTable);
    } else {
        const email = request.session.user.email;
        //Note: earliest is default sort order
        animeTable = await getTable("Anime", "earliest", email);
        mangaTable = await getTable("Manga", "earliest", email);
    }
   
    response.render("myStuff", {animeTable: animeTable, mangaTable: mangaTable});
});

router.post("/filter", async (request, response) => {
    const type = request.body.filterType;
    const sortFilter = request.body.sortFilter;
    let animeTable;
    let mangaTable;

    if (type === "Both") {
        animeTable = await getTable("Anime", sortFilter);
        mangaTable = await getTable("Manga", sortFilter);
    } else {
        if (type === "Anime") {
            animeTable = await getTable("Anime", sortFilter);
            mangaTable = await getTable("Manga", "earliest");
        } else {
            animeTable = await getTable("Anime", "earliest");
            mangaTable = await getTable("Manga", sortFilter);
        }
    }
    //convert tables into string for url
    const animeTableEnc = encodeURIComponent(JSON.stringify(animeTable));
    const mangaTableEnc = encodeURIComponent(JSON.stringify(mangaTable));
    response.redirect(`/myStuff?animeTable=${animeTableEnc}&mangaTable=${mangaTableEnc}`);
});

router.post("/delContent", async (request, response) => {
    let ID = request.body.contentID;
    let type = request.body.contentType;
    if (type === "Anime") {
        await delAnimeContent(ID);
    } else {
        await delMangaContent(ID);
    }
    response.redirect("/myStuff");
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

async function getTable(type, sortFilter, email) {
    console.log(`Email: ${email}`);
    let idName;
    if (type === "Anime") {
        idName = "animeTable";
    } else {
        id = "mangaTable"
    }
    let table = `<table class="myStuffTable" id="${idName}">`;
    table += `<colgroup>
                <col style="width: 2%">   
                <col style="width: 20%">   
                <col style="width: 7.5%">  
                <col style="width: 18%">   
                <col style="width: 10.5%">  
                <col style="width: 8%">
                <col style="width: 20%"> 
                <col style="width: 14%"> 
            </colgroup>`;
    table += `<thead> <tr> <th>#</th> <th>Title</th> <th>Type</th> <th>Genre</th> <th>Status</th> <th>Rating</th> <th>Comments</th> <th></th></tr> <thead>`;
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        let collectionName = (type === "Anime" ? "animes":"mangas");
        const collection = mongoose.connection.db.collection(collectionName);
        let data; 
        //Sorts Database first according to sortFilter
        if (sortFilter !== "earliest") {
            if (sortFilter === "newest") {
                data = await collection.find({user: email}).sort({ _id: -1}).toArray();
            } else if (sortFilter === "title-asc") {
                data = await collection.find({user: email}).sort({ title: 1}).toArray();
            } else if (sortFilter === "title-des") {
                data = await collection.find({user: email}).sort({ title: -1}).toArray();
            } else if (sortFilter === "status") {
                data = await collection.find({user: email}).sort({ status: 1}).toArray();
            } else if (sortFilter === "rating-asc") {
                data = await collection.find({user: email}).sort({ rating: 1}).toArray();
            } else if (sortFilter === "rating-des") {
                data = await collection.find({user: email}).sort({ rating: -1}).toArray();
            } 
        } else {
            data = await collection.find({user: email}).toArray();
        }
        
        //Get data from database and formats each data and its field as a table row
        let tableEntries = "";
        let count = 0;
        data.forEach( content => {
            tableEntries += `<tr> <td>${++count}</td> <td class="title-cell">${content.title}</td> <td>${content.type}</td> <td class="genre-cell">${content.genre}</td> <td class="status-cell">${content.status}</td> <td>${content.rating}</td> <td class="comment-cell">${content.comments}</td> <th> <form action="myStuff/delContent" method="POST"> <input type="hidden" name="contentID" value="${content._id}"> <input type="hidden" name="contentType" value="${type}"> <button class="delTableContent" type="submit">Delete</button> </form> </th> </tr>`;
        });
        if (tableEntries === "") {
            table += `<tbody class="myStuffTableBody"> <tr> <td colspan="8">None</td> </tr> </tbody>`;
        } else {
            table += `<tbody class="myStuffTableBody"> ${tableEntries} </tbody>`;
        }
        mongoose.disconnect();
    } catch (err) {
      console.error(err);
      table += `<tbody class="myStuffTableBody"> <tr> <td colspan="8">None</td> </tr> </tbody>`;
    }
    table += `</table>`;
    return table;
}

async function delAnimeContent(id) {
    const objectID = new mongoose.Types.ObjectId(id);
    try {
        console.log(`deleting Anime - ${id}`);
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const animeCollection = mongoose.connection.db.collection("animes");
        await animeCollection.deleteOne({ _id: objectID });
        mongoose.disconnect();
    } catch (err) {
      console.error(err);
    }
    return;
}

async function delMangaContent(id) {
     try {
        console.log(`deleting Manga - ${id}`);
        const objectID =  new mongoose.Types.ObjectId(id);
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const mangaCollection = mongoose.connection.db.collection("mangas");
        await mangaCollection.deleteOne({ _id: objectID });
        mongoose.disconnect();
    } catch (err) {
      console.error(err);
    }
    return;
}
module.exports = router; 