"use strict";

import { fetchGameData } from "./api.js";
import { countGenres, countTags, getPriceDistribution, getTop3GamesByPeakPlayers, countMostOwnedGames, countTagsByGenre } from "../data/countFunctions.js";
import { transformDataForStackedChart } from "../data/dataTransformFunctions.js";
import { createBarChart, createHorizontalBarChartTop3, createTopGamesBarChart } from "../charts/barChart.js";
import { createPriceDistributionChart } from "../charts/priceChart.js";
import { createStackedColumnChart } from "../charts/stackedChart.js";

async function main() {
    try {
        const data = await fetchGameData();
        console.log(data);

        // Create bar charts for most popular genres and tags
        const genreCount = await countGenres(data);
        const tagCount = await countTags(data);
        createBarChart("topGenres", "Most Popular Game Genres", genreCount, 'genre');
        createBarChart("topTags", "Most Popular Game Tags", tagCount, 'tag');

        // Create a bar chart for the price distribution
        const priceDistribution = await getPriceDistribution(data);
        createPriceDistributionChart("priceDistributionChart", "Price Distribution of Games", priceDistribution);

        // Create a bar chart for the Biggest Peak Players
        const top3games = await getTop3GamesByPeakPlayers(data);
        createHorizontalBarChartTop3("top3games", "Top 3 Highest peak of players", top3games);

        // Create a bar chart for the Most Owned Games
        const mostOwnedGames = await countMostOwnedGames(data);
        createTopGamesBarChart("mostOwnedGames", "Most Owned Games", mostOwnedGames);

        // Create stacked chart that shows the relationship between genres and tags
        const tagGenreCount = await countTagsByGenre(data);
        const { genres, datasets } = transformDataForStackedChart(tagGenreCount);
        createStackedColumnChart("topTagsByGenre", "Top Tags and Their Genres", genres, datasets);

    } catch (error) {
        console.error(error);
    }
}

main();
