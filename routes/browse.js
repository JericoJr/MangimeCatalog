const express = require('express');
const router = express.Router();

router.get("/", async (request, response) => {
    const topAnime = await topAnimeList();
    const topManga = await topMangaList();
    response.render("browse", { topAnimeList: topAnime, topMangaList: topManga});
});

async function topAnimeList() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const result = await response.json();
        let list = "";
        let count = 0;
        const arr = result.data;
        arr.forEach( anime => {
            let genresArr = anime.genres;
            let str_genres = genresArr.map(genre => genre.name).join(", ");
            list += 
            `<tr class="TopTableRow"> 
            <td>${count = count + 1}</td> 
            <td class="td-animeCover"><img class="animeCover" src="${anime.images.jpg.large_image_url}"></td> 
            <td>${anime.title_english || anime.title}</td> 
            <td>${str_genres}</td> 
            <td>${anime.status}</td> 
            </tr>`;
        })
        return list;
    } catch(error) {
        console.log("\nError fetching anime:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}

async function topMangaList() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/manga');
        const result = await response.json();
        let list = "";
        let count = 0;
        const arr = result.data;
        arr.forEach( manga => {
            let genresArr = manga.genres;
            let str_genres = genresArr.map(genre => genre.name).join(", ");
            list += 
            `<tr class="topTableRow"> 
            <td>${count = count + 1}</td> 
            <td><img class="mangaCover" src="${manga.images.jpg.large_image_url}"></td> 
            <td>${manga.title_english || manga.title}</td> 
            <td>${str_genres}</td> 
            <td>${manga.status}</td> 
            </tr>`;
        })
        // list +=  `<tr><td colspan="5">End</td></tr>`;
        return list;
    } catch(error) {
        console.log("\nError fetching manga:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}

module.exports = router; 