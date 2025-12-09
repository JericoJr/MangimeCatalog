const express = require('express');
const router = express.Router();

router.get("/", async (request, response) => {
    const list = await top10Anime();
    response.render("browse", { animeList: list });
});

async function top10Anime() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const result = await response.json();
        let list = "";
        const arr = result.data;
        arr.forEach( anime => {
            list += 
            `<tr> 
            <th><img class="animeCover" src="${anime.images.jpg.large_image_url}"></th> 
            <th>${anime.rank}</th> 
            <th>${anime.title_english || anime.title}</th> 
            <th>${anime.genres.type}</th> 
            <th>${anime.status}</th> 
            </tr>`;
        })
        list +=  `<tr><td colspan="5">End</td></tr>`;
        return list;
    } catch(error) {
        console.log("\nError fetching anime:", error);
        return `<tr><td colspan="5">Error Fetching Data</td></tr>`;
    }
}

module.exports = router; 