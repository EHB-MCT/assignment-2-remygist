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
        computeGenreMetrics();
        computeTagMetrics()
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
        const avgOwners = game.owners.average;
        const day1Players = game.playerPeak[0].players;
        const lastPlayers = game.playerPeak[game.playerPeak.length - 1].players;

        //group for genre
        game.genres.forEach(genre => {
            if (!genreMetrics[genre]) {
                genreMetrics[genre] = {
                    totalOwners: 0,
                    totalDay1Players: 0,
                    totalLastPlayers: 0,
                    gameCount: 0
                };
            }

            genreMetrics[genre].totalOwners += avgOwners;
            genreMetrics[genre].totalDay1Players += day1Players;
            genreMetrics[genre].totalLastPlayers += lastPlayers;
            genreMetrics[genre].gameCount += 1;
        })

    })

    //compute genre
    const genreResults = {};
    Object.entries(genreMetrics).forEach(([genre, metrics]) => {
        const { totalOwners, totalDay1Players, totalLastPlayers, gameCount } = metrics;

        const avgOwnershipToPlayerRatio = (totalDay1Players / totalOwners) * 100;
        const avgRetentionRate = (totalLastPlayers / totalDay1Players) * 100;

        genreResults[genre] = {
            avgOwnershipToPlayerRatio: avgOwnershipToPlayerRatio.toFixed(2),
            avgRetentionRate: avgRetentionRate.toFixed(2),
            totalOwners,
            totalDay1Players,
            totalLastPlayers,
            gameCount
        };
    });
    console.log(genreResults);
}

async function computeTagMetrics() {
    console.log("Tag metrics:");
    const tagMetrics = {};

    data.forEach(game => {
        const avgOwners = game.owners.average;
        const day1Players = game.playerPeak[0].players;
        const lastPlayers = game.playerPeak[game.playerPeak.length - 1].players;

        //group for tags
        game.tags.forEach(tag => {
            if (!tagMetrics[tag]) {
                tagMetrics[tag] = {
                    totalOwners: 0,
                    totalDay1Players: 0,
                    totalLastPlayers: 0,
                    gameCount: 0
                };
            }

            tagMetrics[tag].totalOwners += avgOwners;
            tagMetrics[tag].totalDay1Players += day1Players;
            tagMetrics[tag].totalLastPlayers += lastPlayers;
            tagMetrics[tag].gameCount += 1;
        })
    })

    //compute tags
    const tagResults = {};
    Object.entries(tagMetrics).forEach(([tag, metrics]) => {
        const { totalOwners, totalDay1Players, totalLastPlayers, gameCount } = metrics;

        const avgOwnershipToPlayerRatio = (totalDay1Players / totalOwners) * 100;
        const avgRetentionRate = (totalLastPlayers / totalDay1Players) * 100;

        tagResults[tag] = {
            avgOwnershipToPlayerRatio: avgOwnershipToPlayerRatio.toFixed(2),
            avgRetentionRate: avgRetentionRate.toFixed(2),
            totalOwners,
            totalDay1Players,
            totalLastPlayers,
            gameCount
        };
    });
    console.log(tagResults);
}

fetchData();