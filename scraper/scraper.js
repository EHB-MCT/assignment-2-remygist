"use strict";
import "dotenv/config";
import puppeteer from "puppeteer";
import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

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
	const data = await getData(page);
    browser.close();
    return data;
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

        //scraping gameName
		const gameNameElement = await page.$("h3");
		if (gameNameElement) {
			const gameName = await page.evaluate(
				(el) => el.innerText,
				gameNameElement
			);

            //scraping genres
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

            //scraping tags
            const tagsElement = await page.$$( '.p-r-30 [href^="/tag/"]');
            const tags = await Promise.all(
                tagsElement.map(tag => page.evaluate(el => el.textContent.trim(), tag)) // Get the inner text of each tag
            );

            //scraping release date
            const releaseDate = await page.evaluate(() => {
                const releaseDateElement = Array.from(document.querySelectorAll("strong")).find(
                    (el) => el.textContent.trim() === "Release date" 
                ); 
                if (releaseDateElement && releaseDateElement.nextSibling) {
                    const rawText = releaseDateElement.nextSibling.textContent.trim();
                    const match = rawText.match(/[A-Za-z]{3} \d{1,2}, \d{4}/);
                    if (match) {
                        const date = new Date(match[0]);
                        return date.toISOString().split('T')[0];
                    }
                }
                return null; 
            })

            //scraping price
            const price = await page.evaluate(() => {
                const priceElement = Array.from(document.querySelectorAll("strong")).find(
                    (el) => el.textContent.trim() === "Price:"
                );
                if (priceElement && priceElement.nextSibling) {                    
                    const priceText = priceElement.nextSibling.textContent.trim();
                    return priceText
                }
                return null;
            })

            //scraping owners
            const owners = await page.evaluate(() => {
                const ownersElement = Array.from(document.querySelectorAll("strong")).find(
                    (el) => el.textContent.trim() === "Owners"
                );
                if (ownersElement && ownersElement.nextSibling) {                    
                    // Get the ownership range as a string
                    const ownersText = ownersElement.nextSibling.textContent.trim();
                    console.log("Owners text:", ownersText); // Debug output
                    
                    // Use regex to extract the numbers from the range
                    const match = ownersText.match(/([\d,]+)\s*\.\.\s*([\d,]+)/);
                    if (match) {
                        const min = parseInt(match[1].replace(/,/g, ''), 10);
                        const max = parseInt(match[2].replace(/,/g, ''), 10);
                        const average = Math.round((min + max) / 2);
                        return { min, max, average };
                    }
                    return { min: null, max: null, average: null }; // Handle cases with unexpected format
                }
                return null;
            }) 

            //scraping yesterdays peak concurrent players
            const players = await page.evaluate(() => {
                const playersElement = Array.from(document.querySelectorAll("strong")).find(
                    (el) => el.textContent.trim() === "Peak concurrent players yesterday"
                );
                if (playersElement && playersElement.nextSibling) {       
                    const playersText = playersElement.nextSibling.textContent.trim();
                    const cleanedPlayersText = playersText.replace(/[^0-9,]/g, '').replace(/,/g, '');
                    return parseInt(cleanedPlayersText, 10);
                }
                return null;
            })
            
            //calculating yesterdays date 
            const getYesterdayDate = () => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday.toISOString().split('T')[0];
            };
            const yesterdaysDate = getYesterdayDate();
            
            const playerPeak = {
                players: players,
                date: yesterdaysDate
            }

			dataArray.push({
				gameName: gameName,
				genres: genres,
                tags: tags,
                releaseDate: releaseDate,
                price: price,
                owners: owners,
                playerPeak: playerPeak 
			});
		}
	}
	console.log(dataArray);
    return dataArray
};

app.get('/getData', async(req,res) => {
    try{
        const data = await init();
        res.json(data)
    } catch(error) {
        console.error('Error scraping game data: ', error);
        res.status(500).send('Error retrieving game data.')
    }
})

app.post('/postData', async(req,res) => {
    try{
        await client.connect();
        const data = {
            gameName: req.body.gameName,
            genres: req.body.genres,
            tags: req.body.tags,
            releaseDate: req.body.releaseDate,
            price: req.body.price,
            owners: req.body.owners,
            playerPeak: req.body.playerPeak
        }

        const collection = client.db("DEV5").collection("game-data");
        const insertData = await collection.insertOne(data)
        res.status(201).send({
            status: "Saved",
            message: "Game data has been saved",
            data: insertData
        })
    } catch(error){
        console.error('Error posting data to DB: ', error);
    }
})

app.listen(port, () => {
    console.log('Server is running on port ' + port);
    
})
