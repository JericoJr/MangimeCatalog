const express = require('express');
const router = express.Router();


router.get("/", async (request, response) => {
    let randAnime = await randomContent("Anime");
    while (randAnime === "Data Error") {
        randAnime = await randomContent("Anime");
    }
    let randManga = await randomContent("Manga");
     while (randManga === "Data Error") {
        randManga = await randomContent("Manga");
    }
    response.render("home", {randomAnime: randAnime, randomManga: randManga});
});


async function randomContent(type) {
    try {
        let displayPick = "";
        let response; 
        if (type === "Anime") {
            response = await fetch('https://api.jikan.moe/v4/recommendations/anime');
        } else {
            response = await fetch('https://api.jikan.moe/v4/recommendations/manga');
        }
        const result = await response.json();
        const data = result.data;
        if (!data || !Array.isArray(data) || data.length === 0) {
            return "Data Error";
        }
        const randIndex = Math.floor(Math.random() * data.length);
        const pick = data[randIndex];
        const entry = pick.entry[0];

        displayPick += `<p class="random${type}Pick">${entry.title}</p><div class="randomImgContainer"><img class="random${type}Img" src="${entry.images.webp.image_url}"></div>`;
        return displayPick;
    } catch(error) {
        console.log("\nError fetching data:", error);
        return "None";
    }
};

module.exports = router; 