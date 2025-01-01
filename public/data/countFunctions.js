// Count genres in the dataset
export async function countGenres(data) {
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
export async function countTags(data) {
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

// Count price distribution
export async function getPriceDistribution(data) {
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

// Get Top 3 games by peak players
export async function getTop3GamesByPeakPlayers(data) {
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

// Count most owned games
export async function countMostOwnedGames(data) {
    console.log("Counting most owned games...");

    // Sort games by average number of owners
    const sortedGames = data
        .filter(game => game.owners && game.owners.average)  // Filter out games without ownership data
        .sort((a, b) => b.owners.average - a.owners.average)  // Sort by owners.average in descending order
        .slice(0, 10);  // Get the top 3 games

    console.log(sortedGames);
    return sortedGames;
}

// Count amount of tags for each genre
export async function countTagsByGenre(data) {
    console.log("Counting tags by genre...");

    const genreTagCount = {};
    const tagFrequency = {};

    // Count tags and genres
    data.forEach(game => {
        game.genres.forEach(genre => {
            if (!genreTagCount[genre]) {
                genreTagCount[genre] = {};
            }

            game.tags.forEach(tag => {
                // Count tags for the genre
                genreTagCount[genre][tag] = (genreTagCount[genre][tag] || 0) + 1;

                // Count total tag frequency
                tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
            });
        });
    });

    // Get top 10 genres based on total tag frequency
    const topGenres = Object.entries(genreTagCount)
        .sort((a, b) => {
            const aTotalTags = Object.values(a[1]).reduce((sum, count) => sum + count, 0);
            const bTotalTags = Object.values(b[1]).reduce((sum, count) => sum + count, 0);
            return bTotalTags - aTotalTags;
        })
        .slice(0, 8)
        .map(([genre]) => genre);

    // Filter for the top 10 genres
    const filteredTagGenreCount = {};
    topGenres.forEach(genre => {
        const tagsInGenre = genreTagCount[genre];

        // Get top 5 tags for each genre
        const topTags = Object.entries(tagsInGenre)
            .sort((a, b) => b[1] - a[1]) // Sort by tag frequency
            .slice(0, 3) // Limit to top 5 tags
            .reduce((obj, [tag, count]) => {
                obj[tag] = count;
                return obj;
            }, {});

        filteredTagGenreCount[genre] = topTags;
    });

    console.log(filteredTagGenreCount);
    return filteredTagGenreCount;
}