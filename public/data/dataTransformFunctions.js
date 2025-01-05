export function transformDataForStackedChart(tagGenreCount) {
    const genres = Object.keys(tagGenreCount); // Genres for x-axis
    const tags = new Set(); // Collect all unique tags

    // Gather all tags
    genres.forEach(genre => {
        Object.keys(tagGenreCount[genre]).forEach(tag => tags.add(tag));
    });

    // Convert tags to an array
    const tagArray = Array.from(tags);

    // Build datasets for each tag
    const datasets = tagArray.map(tag => ({
        label: tag,
        data: genres.map(genre => tagGenreCount[genre][tag] || 0), // Tag count per genre
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.7)`, // Random color for each tag
    }));

    return { genres, datasets };
}