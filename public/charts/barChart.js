import Chart from 'chart.js/auto'

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

export function createHorizontalBarChartTop3(canvasId, title, top3Games) {
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

export function createTopGamesBarChart(canvasId, title, topGames) {
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
