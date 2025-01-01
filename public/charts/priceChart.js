import Chart from 'chart.js/auto';

export function createPriceDistributionChart(canvasId, title, priceDistribution) {
    const labels = Object.keys(priceDistribution); // Price bracket labels
    const values = Object.values(priceDistribution); // Number of games in each price bracket

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Games',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)', // Bar fill color
                borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
                borderWidth: 1, // Border thickness
                hoverBorderWidth: 2, // Thicker border on hover
            }],
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
                    display: false, // Disable legend (only one dataset)
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw} games`;
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
                    title: {
                        display: true,
                        text: 'Price Range',
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
                    title: {
                        display: true,
                        text: 'Number of Games',
                        font: {
                            size: 14,
                        },
                        color: '#555',
                    },
                    ticks: {
                        stepSize: 5, // Adjust step size for y-axis
                        font: {
                            size: 12,
                        },
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)', // Light gray horizontal grid lines
                        borderDash: [5, 5], // Dotted grid lines
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}
