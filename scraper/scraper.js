"use strict";

import "dotenv/config";
import puppeteer from "puppeteer";

const linksArray = [];
const dataArray = [];

const init = async () => {
	console.log("init");
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		headless: false,
	});
	// Use the first page opened
	const [page] = await browser.pages();

	await goToHomepage(page);
	await getData(page);
};

const goToHomepage = async (page) => {
	// Navigate the page to a URL
	try {
		await page.goto(process.env.BASE_URL, {
			waitUntil: "domcontentloaded",
		});
	} catch (error) {
		console.error("Failed to navigate to homepage:", error);
	}
};

const getData = async (page) => {
	const links = await page.$$("[data-order] a");
	let gameCount = 0;
	for (const link of links.slice(0, 5)) {
		const href = await page.evaluate((el) => el.href, link);
		linksArray.push(href);
	}

	for (let i = 0; i < linksArray.length; i++) {
		await page.goto(linksArray[i], {
			waitUntil: "domcontentloaded",
		});
		//TODO: get genre + tags + release date + price + peak concurrent players

		const gameNameElement = await page.$("h3");
		if (gameNameElement) {
			const gameName = await page.evaluate(
				(el) => el.innerText,
				gameNameElement
			);

			const genres = await page.evaluate(() => {
				const genreLabel = Array.from(document.querySelectorAll("strong")).find(
					(el) => el.textContent.trim() === "Genre:"
				);

				if (genreLabel) {
					const genreLinks = Array.from(
						genreLabel.parentElement.querySelectorAll("a")
					).filter((el) => el.href.includes("/genre/"));
					return genreLinks.map((el) => el.innerText.trim());
				}
				return [];
			});

			dataArray.push({
				gameName: gameName,
				genres: genres,
			});
		}
	}
	console.log(dataArray);
};

init();
