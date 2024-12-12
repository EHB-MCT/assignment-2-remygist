"use strict"
import Chart from 'chart.js/auto'

let data;

async function fetchData() {
    try{
        const response = await fetch(
            "https://assignment-2-remygist-1.onrender.com/fetchData"
        );
        data = await response.json();
        countGenres();
        countTags();
    }catch (error) {
        console.log(error);
    }
}

async function countGenres() {
    console.log("counting genres");
    const genreCount = {};

    data.forEach(game => {
        game.genres.forEach(genre => {
            if (genreCount[genre]) {
                genreCount[genre]++;
            } else {
                genreCount[genre] = 1;
            }
        });
    });

    // Sort
    const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1]); 
    const sortedGenreCount = Object.fromEntries(sortedGenres);

    console.log(sortedGenreCount);
}

async function countTags(){
    console.log("counting tags");
    const tagsCount = {};

    data.forEach(game => {
        game.tags.forEach(tag => {
            if (tagsCount[tag]){
                tagsCount[tag]++;
            } else {
                tagsCount[tag] = 1;
            }
        });
    });

    // Sort
    const sortedTags = Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1]); 
    const sortedTagsCount = Object.fromEntries(sortedTags);

    console.log(sortedTagsCount);
}

fetchData();