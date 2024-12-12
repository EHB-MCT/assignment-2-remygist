"use strict"
import Chart from 'chart.js/auto'



async function fetchData() {
    try{
        const response = await fetch(
            "https://assignment-2-remygist-1.onrender.com/fetchData"
        );
        const data = await response.json();
        console.log(data);
        showGraph(data);
    }catch (error) {
        console.log(error);
    }
}

async function showGraph(data) {
    console.log(data);
};

fetchData();