import Chart from 'chart.js/auto'

export function createPriceDistributionChart(canvasId, title, priceDistribution) {
    const labels = Object.keys(priceDistribution);  // Price bracket labels
    const values = Object.values(priceDistribution);  // Number of games in each price bracket

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Games',
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
                        text: 'Price Range'
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