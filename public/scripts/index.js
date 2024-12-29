"use strict"
import Chart from 'chart.js/auto'

let data;

async function fetchData() {
    try {
        const response = await fetch(
            "https://assignment-2-remygist-1.onrender.com/fetchData"
        );
        data = await response.json();
        const genreCount = await countGenres();
        const tagCount = await countTags();

        // Create bar charts for most popular genres and tags
        createBarChart("topGenres", "Most Popular Game Genres", genreCount, 'genre');
        createBarChart("topTags", "Most Popular Game Tags", tagCount, 'tag');

    } catch (error) {
        console.log(error);
    }
}

// Count genres in the dataset
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

    // Sort and get top 10 genres
    const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    const sortedGenreCount = Object.fromEntries(sortedGenres);

    console.log(sortedGenreCount);
    return sortedGenreCount;
}

// Count tags in the dataset
async function countTags() {
    console.log("counting tags");
    const tagsCount = {};

    data.forEach(game => {
        game.tags.forEach(tag => {
            if (tagsCount[tag]) {
                tagsCount[tag]++;
            } else {
                tagsCount[tag] = 1;
            }
        });
    });

    // Sort and get top 10 tags
    const sortedTags = Object.entries(tagsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    const sortedTagsCount = Object.fromEntries(sortedTags);

    console.log(sortedTagsCount);
    return sortedTagsCount;
}

function createBarChart(canvasId, title, data, type) {
    const labels = Object.keys(data);  // Genre or tag names
    const values = Object.values(data);  // Number of games for each genre or tag

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Number of ${type === 'genre' ? 'Genres' : 'Tags'}`,
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw} games`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${type === 'genre' ? 'Genres' : 'Tags'}`
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Games'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

fetchData();
