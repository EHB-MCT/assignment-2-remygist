"use strict"
import Chart from 'chart.js/auto'

let data;

async function fetchData() {
    try {
        const response = await fetch(
            "https://assignment-2-remygist-1.onrender.com/fetchData"
        );
        data = await response.json();
        countGenres();
        countTags();
        
        const genreMetrics = await computeGenreMetrics();
        const tagMetrics = await computeTagMetrics();
        
        // Only create charts if metrics are valid
        if (genreMetrics && tagMetrics) {
            createChart("genreChart", "Genres", genreMetrics);
            createChart("tagChart", "Tags", tagMetrics);
        } else {
            console.error("Metrics computation failed, no charts will be created.");
        }
    } catch (error) {
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

    // Sort
    const sortedTags = Object.entries(tagsCount)
        .sort((a, b) => b[1] - a[1]);
    const sortedTagsCount = Object.fromEntries(sortedTags);

    console.log(sortedTagsCount);
}

async function computeGenreMetrics() {
    console.log("Genre metrics:");
    const genreMetrics = {};

    data.forEach(game => {
        if (game.owners && game.owners.average && game.playerPeak && game.playerPeak.length > 0) {
            const avgOwners = game.owners.average;
            const day1Players = game.playerPeak[0].players || 0;  // Default to 0 if not available
            const lastPlayers = game.playerPeak[game.playerPeak.length - 1].players || 0;  // Default to 0 if not available

            game.genres.forEach(genre => {
                if (!genreMetrics[genre]) {
                    genreMetrics[genre] = {
                        totalOwners: 0,
                        totalDay1Players: 0,
                        totalLastPlayers: 0,
                        gameCount: 0
                    };
                }

                genreMetrics[genre].totalOwners += avgOwners || 0;
                genreMetrics[genre].totalDay1Players += day1Players;
                genreMetrics[genre].totalLastPlayers += lastPlayers;
                genreMetrics[genre].gameCount += 1;
            });
        }
    });

    const genreResults = {};
    Object.entries(genreMetrics).forEach(([genre, metrics]) => {
        const { totalOwners, totalDay1Players, totalLastPlayers, gameCount } = metrics;

        const avgOwnershipToPlayerRatio = totalOwners > 0 ? (totalDay1Players / totalOwners) * 100 : 0;
        const avgRetentionRate = totalDay1Players > 0 ? (totalLastPlayers / totalDay1Players) * 100 : 0;

        genreResults[genre] = {
            avgOwnershipToPlayerRatio: avgOwnershipToPlayerRatio.toFixed(2),
            avgRetentionRate: avgRetentionRate.toFixed(2),
            totalOwners,
            totalDay1Players,
            totalLastPlayers,
            gameCount
        };
    });
    
    return genreResults;  // Return the computed genre results
}

async function computeTagMetrics() {
    console.log("Tag metrics:");
    const tagMetrics = {};

    data.forEach(game => {
        if (game.owners && game.owners.average && game.playerPeak && game.playerPeak.length > 0) {
            const avgOwners = game.owners.average;
            const day1Players = game.playerPeak[0].players || 0;
            const lastPlayers = game.playerPeak[game.playerPeak.length - 1].players || 0;

            game.tags.forEach(tag => {
                if (!tagMetrics[tag]) {
                    tagMetrics[tag] = {
                        totalOwners: 0,
                        totalDay1Players: 0,
                        totalLastPlayers: 0,
                        gameCount: 0
                    };
                }

                tagMetrics[tag].totalOwners += avgOwners || 0;
                tagMetrics[tag].totalDay1Players += day1Players;
                tagMetrics[tag].totalLastPlayers += lastPlayers;
                tagMetrics[tag].gameCount += 1;
            });
        }
    });

    const tagResults = {};
    Object.entries(tagMetrics).forEach(([tag, metrics]) => {
        const { totalOwners, totalDay1Players, totalLastPlayers, gameCount } = metrics;

        const avgOwnershipToPlayerRatio = totalOwners > 0 ? (totalDay1Players / totalOwners) * 100 : 0;
        const avgRetentionRate = totalDay1Players > 0 ? (totalLastPlayers / totalDay1Players) * 100 : 0;

        tagResults[tag] = {
            avgOwnershipToPlayerRatio: avgOwnershipToPlayerRatio.toFixed(2),
            avgRetentionRate: avgRetentionRate.toFixed(2),
            totalOwners,
            totalDay1Players,
            totalLastPlayers,
            gameCount
        };
    });

    return tagResults;  // Return the computed tag results
}

function createChart(canvasId, title, metrics) {
    if (!metrics || Object.keys(metrics).length === 0) {
        console.error(`No metrics available for ${title}`);
        return;
    }

    const labels = Object.keys(metrics);  // Genre or tag names
    const ownershipRatios = labels.map(label => parseFloat(metrics[label].avgOwnershipToPlayerRatio));
    const retentionRates = labels.map(label => parseFloat(metrics[label].avgRetentionRate));

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ownership-to-Player Ratio (%)',
                    data: ownershipRatios,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    stack: 'Stack 0'
                },
                {
                    label: 'Retention Rate (%)',
                    data: retentionRates,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    stack: 'Stack 0'
                }
            ]
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
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                }
            }
        }
    });
}

fetchData();