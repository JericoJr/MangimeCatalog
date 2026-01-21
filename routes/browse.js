const express = require('express');
const router = express.Router();


router.get("/", async (request, response) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    await delay(350);
    const topAnime = await topAnimeList();
    
    await delay(350);
    const topManga = await topMangaList();
    
    await delay(350);
    const current = await currentList();
    
    await delay(350);
    const upcoming = await upcomingList();
    response.render("browse", {topAnimeList: topAnime, topMangaList: topManga, currentList: current, upcomingList: upcoming});
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
            `<tr class="topTableRow"> 
            <td>${count = count + 1}</td> 
            <td class="animeCover"><img class="animeCover" src="${anime.images.jpg.large_image_url}"></td> 
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
        // list += `<tr><td colspan="5">End</td></tr>`;
        return list;
    } catch(error) {
        console.log("\nError fetching manga:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}

async function currentList() {
        try {
        const response = await fetch('https://api.jikan.moe/v4/seasons/now');
        const result = await response.json();
        let list = "";
        const arr = result.data;
        arr.forEach( anime => {
            let genresArr = anime.genres;
            let str_genres = genresArr.map(genre => genre.name).join(", ");
            list += 
            `<tr class="currentTableRow"> 
            <td class="cu-animeCover"><img class="animeCover" src="${anime.images.jpg.large_image_url}"></td> 
            <td>${anime.title_english || anime.title}</td> 
            <td>${str_genres}</td> 
            <td>${anime.status}</td> 
            <td>${anime.score || "n/a"}</td>
            <td>${anime.episodes || "n/a"}</td>
            </tr>`;
        })
        return list;
    } catch(error) {
        console.log("\nError fetching current list:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}

async function upcomingList() {
        try {
        const response = await fetch('https://api.jikan.moe/v4/seasons/upcoming');
        const result = await response.json();
        // console.log(result);
        let list = "";
        const arr = result.data;
        arr.forEach( anime => {
            let genresArr = anime.genres;
            let str_genres = genresArr.map(genre => genre.name).join(", ");
            list += 
            `<tr class="upcomingTableRow"> 
            <td class="cu-animeCover"><img class="animeCover" src="${anime.images.jpg.large_image_url}"></td> 
            <td>${anime.title_english || anime.title}</td> 
            <td>${anime.type}</td> 
            <td>${str_genres}</td> 
            <td>${anime.season || "n/a"}</td>
            <td> ${ anime.trailer.embed_url ? `<a href="${anime.trailer.embed_url}">link</a>`: "n/a"}
            </td>
            </tr>`;
        })
        return list;
    } catch(error) {
        console.log("\nError fetching upcoming list:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}


module.exports = router; 