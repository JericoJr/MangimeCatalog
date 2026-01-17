const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", async (request, response) => {
    // console.log("Entering myStuff Page");
    let animeTable;
    let mangaTable;
    let editForm;
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

    if (request.query.editForm) {
        editForm = JSON.parse(request.query.editForm);
    } else {
        editForm = null;
    }
    response.render("myStuff", {animeTable: animeTable, mangaTable: mangaTable, editForm: editForm});
});

router.post("/filter", async (request, response) => {
    const type = request.body.filterType;
    const sortFilter = request.body.sortFilter;
    const email = request.session.user.email;
    let animeTable;
    let mangaTable;

    if (type === "Both") {
        animeTable = await getTable("Anime", sortFilter, email);
        mangaTable = await getTable("Manga", sortFilter, email);
    } else {
        if (type === "Anime") {
            animeTable = await getTable("Anime", sortFilter, email);
            mangaTable = await getTable("Manga", "earliest", email);
        } else {
            animeTable = await getTable("Anime", "earliest", email);
            mangaTable = await getTable("Manga", sortFilter, email);
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

router.post("/editContent", async (request, response) => {
    let ID = request.body.contentID;
    let type = request.body.contentType;
    let editForm = await editContent(type, ID);
    const editFormEnc = encodeURIComponent(JSON.stringify(editForm));
    response.redirect(`/myStuff?editForm=${editFormEnc}`);
});

router.post("/submitEdit", async(request, response) => {
    const clickedButton = request.body.editAction; // either "Cancel" or "Submit"

    if (clickedButton === "Cancel") {
        console.log("Cancel Editing");
    } else {
        const result = await editDataDB(request);
        if (result) {
            console.log("Successfully Edit Data");
        } else {
            console.log("Error with Edit Data");
        }
    }
    response.redirect("/myStuff");
})

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
    // console.log(`Email: ${email}`);
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
                <col style="width: 12.5%">  
                <col style="width: 8%">
                <col style="width: 20%"> 
                <col style="width: 12%"> 
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
            tableEntries += `<tr>   
                                    <td>${++count}</td> 
                                    <td class="title-cell">${content.title}</td> 
                                    <td>${content.type}</td> 
                                    <td class="genre-cell">${content.genre}</td> 
                                    <td class="status-cell">${content.status}</td> 
                                    <td>${content.rating}</td> <td class="comment-cell">${content.comments}</td> 
                                    <td class="buttons-cell"> 
                                        <div class="buttons-cell-section">
                                        <form action="/myStuff/editContent" method="POST"> <input type="hidden" name="contentID" value="${content._id}"> 
                                            <input type="hidden" name="contentType" value="${type}"> 
                                            <button class="editTableContent" type="submit">Edit</button> 
                                        </form> 
                                        <form action="/myStuff/delContent" method="POST"> <input type="hidden" name="contentID" value="${content._id}"> 
                                            <input type="hidden" name="contentType" value="${type}"> 
                                            <button class="delTableContent" type="submit">Delete</button> 
                                        </form> 
                                        </div>
                                    </td>
                            </tr>`;
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

async function editContent(typeContent, id) {
    try {
        const objectID = new mongoose.Types.ObjectId(id);
        console.log(`Editing Anime - ${id}`);
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const contentCollection = (typeContent === "Anime" ? mongoose.connection.db.collection("animes") : mongoose.connection.db.collection("mangas"));
        const data = await contentCollection.findOne({_id: objectID});

        let typeSection;
        if (typeContent === "Anime") {
            typeSection = `
                <label> <input type="radio" class="editTypeInput" name="type" value="Manga"> Manga </label>
                <label> <input type="radio" class="editTypeInput" name="type" value="Anime" checked required> Anime </label>
            `;
        } else{
            typeSection = `
                <label> <input type="radio" class="editTypeInput" name="type" value="Manga" checked required> Manga </label>
                <label> <input type="radio" class="editTypeInput" name="type" value="Anime"> Anime </label>
            `;
        }

        let statusSection;
        if (data.status === "Completed") {
            statusSection = `
                <option class="editStatusInputOp" value="Completed" selected>Completed</option>
                <option class="editStatusInputOp" value="Reading/Watching">Reading/Watching</option>
                <option class="editStatusInputOp" value="Waitlist">Waitlist</option>
            `;
        } else if (data.status === "Reading/Watching") {
            statusSection = `
                <option class="editStatusInputOp" value="Completed">Completed</option>
                <option class="editStatusInputOp" value="Reading/Watching" selected>Reading/Watching</option>
                <option class="editStatusInputOp" value="Waitlist">Waitlist</option>
            `;
        } else {
            statusSection = `
                <option class="editStatusInputOp" value="Completed">Completed</option>
                <option class="editStatusInputOp" value="Reading/Watching">Reading/Watching</option>
                <option class="editStatusInputOp" value="Waitlist" selected>Waitlist</option>
            `;
        }

        let editForm = `
            <div class="edit-popup">
                <form action="/myStuff/submitEdit" method="POST" class="editForm">
                    <label class="edit-Title">Edit Form:</label> <br>
                    <input type="hidden" name="objectID" value="${id}"> 
                    <label>Title: <input type="text" class="editTitleInput" name="title" maxlength="75" value="${data.title}" required></label> <br>
                    <label>Type: 
                        ${typeSection}
                    </label> <br>  
                    <label>Status: </label>   
                    <select name="status" class="editStatusInput" required>
                        ${statusSection}
                    </select> <br>     
                    <label>Genre: </label> <br>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Action" ${data.genre.includes("Action") ? "checked" : ""}>Action</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Adventure" ${data.genre.includes("Adventure") ? "checked" : ""}>Adventure</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Comedy" ${data.genre.includes("Comedy") ? "checked" : ""}>Comedy</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Drama" ${data.genre.includes("Drama") ? "checked" : ""}>Drama</label> <br>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Fantasy" ${data.genre.includes("Fantasy") ? "checked" : ""}>Fantasy</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Historical" ${data.genre.includes("Historical") ? "checked" : ""}>Historical</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Horror" ${data.genre.includes("Horror") ? "checked" : ""}>Horror</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Mystery" ${data.genre.includes("Mystery") ? "checked" : ""}>Mystery</label> <br>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Romance" ${data.genre.includes("Romance") ? "checked" : ""}>Romance</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Sci-Fi" ${data.genre.includes("Sci-Fi") ? "checked" : ""}>Sci-Fi</label>
                    <label><input type="checkbox" class="editGenreInput" name="genre" value="Slice-Of-Life" ${data.genre.includes("Slice-Of-Life") ? "checked" : ""}>Slice Of Life</label>
                    <br>
                    <label>Rating: <input type="number" class="editRatingInput" name="rating" min="1" max="10" value="${data.rating}" required> out of 10</label> <br>
                    <label>Comments:</label><br>
                    <label><textarea class="editCommentsInput" rows="10" cols="20" name="comments">${data.comments}</textarea></label>
                    <br>
                    <input class="editCancel" type="submit" name="editAction" value="Cancel">
                    <input class="editReset" type="reset">
                    <input class="editSubmit" type="submit" name="editAction" value="Submit">
                </form>
            </div>
        `; 
        mongoose.disconnect();
        return editForm;
    } catch (err) {
      console.error(err);
      return;
    }
}

async function editDataDB(request) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const objectID =  new mongoose.Types.ObjectId(request.body.objectID);
        const contentCollection = (request.body.type === "Anime" ? mongoose.connection.db.collection("animes") : mongoose.connection.db.collection("mangas"));
        await contentCollection.updateOne({_id: objectID}, {
            $set: {
                title: request.body.title,
                type: request.body.type,
                status: request.body.status,
                genre: request.body.genre,
                rating: request.body.rating,
                comments: request.body.comments
            }
        });
        mongoose.disconnect();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = router; 