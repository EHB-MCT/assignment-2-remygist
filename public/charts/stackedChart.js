import Chart from 'chart.js/auto';

export function createStackedColumnChart(canvasId, title, genres, datasets) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: genres, // X-axis (genres)
            datasets: datasets.map((dataset, index) => ({
                ...dataset,
                borderColor: `rgba(${index * 30 % 255}, ${index * 60 % 255}, ${index * 90 % 255}, 1)`, // Unique border color
                borderWidth: 1, // Border around each bar
                hoverBorderWidth: 2, // Thicker border on hover
            })),
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
                    color: '#333', // Title color
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                },
                legend: {
                    display: false, // Hide legend
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        },
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                    },
                    bodyFont: {
                        size: 12,
                    },
                    padding: 10,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Genres',
                        font: {
                            size: 14,
                        },
                        color: '#555',
                    },
                    grid: {
                        display: false, // Hide vertical grid lines
                    },
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Tags',
                        font: {
                            size: 14,
                        },
                        color: '#555',
                    },
                    ticks: {
                        stepSize: 10, // Customize step size for ticks
                        font: {
                            size: 12,
                        },
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)', // Light gray horizontal grid lines
                        borderDash: [5, 5], // Dotted grid lines
                    },
                },
            },
        },
    });
}
