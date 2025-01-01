import Chart from 'chart.js/auto';

export function createBarChart(canvasId, title, data, type) {
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
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                    color: '#333',
                    padding: { top: 10, bottom: 20 },
                },
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw} games`,
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${type === 'genre' ? 'Genres' : 'Tags'}`,
                        font: { size: 14 },
                        color: '#555',
                    },
                    grid: { display: false },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Games',
                        font: { size: 14 },
                        color: '#555',
                    },
                    ticks: { stepSize: 5, font: { size: 12 } },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        borderDash: [5, 5],
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}

export function createHorizontalBarChartTop3(canvasId, title, top3Games) {
    const labels = top3Games.map((game) => game.name);
    const values = top3Games.map((game) => game.highestPeak);

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peak Players',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y', // Makes it horizontal
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 18, weight: 'bold' },
                    color: '#333',
                    padding: { top: 10, bottom: 20 },
                },
                legend: { display: false },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Peak Players',
                        font: { size: 14 },
                        color: '#555',
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        borderDash: [5, 5],
                    },
                    beginAtZero: true,
                },
                y: {
                    title: {
                        display: true,
                        text: 'Games',
                        font: { size: 14 },
                        color: '#555',
                    },
                    grid: { display: false },
                },
            },
        },
    });
}

export function createTopGamesBarChart(canvasId, title, topGames) {
    const labels = topGames.map((game) => game.gameName); // Game names
    const values = topGames.map((game) => game.owners.average); // Average number of owners

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Number of Owners',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 18, weight: 'bold' },
                    color: '#333',
                    padding: { top: 10, bottom: 20 },
                },
                legend: { display: false },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Games',
                        font: { size: 14 },
                        color: '#555',
                    },
                    grid: { display: false },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Number of Owners',
                        font: { size: 14 },
                        color: '#555',
                    },
                    ticks: { stepSize: 5, font: { size: 12 } },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        borderDash: [5, 5],
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}
