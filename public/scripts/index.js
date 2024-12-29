"use strict"
import Chart from 'chart.js/auto'

let data;

async function fetchData() {
    try {
        const response = await fetch(
            "https://assignment-2-remygist-1.onrender.com/fetchData"
        );
        data = await response.json();
        console.log(data);
        
        // Create bar charts for most popular genres and tags
        const genreCount = await countGenres();
        const tagCount = await countTags();
        createBarChart("topGenres", "Most Popular Game Genres", genreCount, 'genre');
        createBarChart("topTags", "Most Popular Game Tags", tagCount, 'tag');

        // Create a bar chart for the price distribution
        const priceDistribution = await getPriceDistribution();
        createPriceDistributionChart("priceDistributionChart", "Price Distribution of Games", priceDistribution);

        // Create a bar chart for the Biggest Peak Players
        const top3games = await getTop3GamesByPeakPlayers();
        createHorizontalBarChartTop3("top3games", "Top 3 Highest peak of players", top3games)

        // Create a bar chart for the Most Owned Games
        const mostOwnedGames = await countMostOwnedGames();
        createTopGamesBarChart("mostOwnedGames", "Most Owned Games", mostOwnedGames);

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

async function getPriceDistribution() {
    console.log("Counting price distribution");

    const priceBrackets = {
        'Under $10': 0,
        '$10 - $20': 0,
        '$20 - $30': 0,
        '$30 - $40': 0,
        '$40 - $50': 0,
        'Above $50': 0
    };

    data.forEach(game => {
        const priceString = game.price;  // Assuming `price` is a string like "$9.99"
        
        // Remove the '$' sign and convert the string to a number
        const price = parseFloat(priceString.replace('$', ''));

        // Determine the price bracket for each game
        if (price < 10) {
            priceBrackets['Under $10']++;
        } else if (price >= 10 && price < 20) {
            priceBrackets['$10 - $20']++;
        } else if (price >= 20 && price < 30) {
            priceBrackets['$20 - $30']++;
        } else if (price >= 30 && price < 40) {
            priceBrackets['$30 - $40']++;
        } else if (price >= 40 && price < 50) {
            priceBrackets['$40 - $50']++;
        } else {
            priceBrackets['Above $50']++;
        }
    });

    console.log(priceBrackets);
    return priceBrackets;
}

function createPriceDistributionChart(canvasId, title, priceDistribution) {
    const labels = Object.keys(priceDistribution);  // Price bracket labels
    const values = Object.values(priceDistribution);  // Number of games in each price bracket

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Games',
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
                        text: 'Price Range'
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

async function getTop3GamesByPeakPlayers() {
    console.log("Finding top 3 games by peak players");

    const gamePeaks = data.map(game => {
        const highestPeak = game.playerPeak.length > 0
            ? Math.max(...game.playerPeak.map(peak => peak.players))
            : 0;

        return {
            name: game.gameName, 
            highestPeak: highestPeak
        };
    });

    // Sort the games by highest player peak in descending order
    gamePeaks.sort((a, b) => b.highestPeak - a.highestPeak);
    const top3Games = gamePeaks.slice(0, 3);

    console.log(top3Games);
    return top3Games;  
}

function createHorizontalBarChartTop3(canvasId, title, top3Games) {
    const labels = top3Games.map(game => game.name);
    const values = top3Games.map(game => game.highestPeak);

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peak Players',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',  // Makes it horizontal
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Peak Players'
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Games'
                    }
                }
            }
        }
    });
}

// Count most own games
async function countMostOwnedGames() {
    console.log("Counting most owned games...");

    // Sort games by average number of owners
    const sortedGames = data
        .filter(game => game.owners && game.owners.average)  // Filter out games without ownership data
        .sort((a, b) => b.owners.average - a.owners.average)  // Sort by owners.average in descending order
        .slice(0, 10);  // Get the top 3 games

    console.log(sortedGames);
    return sortedGames;
}

function createTopGamesBarChart(canvasId, title, topGames) {
    const labels = topGames.map(game => game.gameName);  // Game names
    const values = topGames.map(game => game.owners.average);  // Average number of owners for each game

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Number of Owners',
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
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Games'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Number of Owners'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}



fetchData();
