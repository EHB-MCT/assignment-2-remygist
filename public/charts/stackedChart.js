import Chart from 'chart.js/auto'

export function createStackedColumnChart(canvasId, title, genres, datasets) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: genres, // X-axis (genres)
            datasets: datasets // Stacked bars for tags
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Genres'
                    }
                },
                y: {
                    stacked: true, 
                    title: {
                        display: true,
                        text: 'Number of Tags'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}