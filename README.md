# Steam game data
Steam Game Data Scraper is a tool that collects and stores data about Steam games automatically. It uses Puppeteer to scrape info like game names, genres, tags, release dates, prices, ownership stats, and player counts from SteamSpy. The data is saved in a MongoDB database, making it easy to use for analysis or visuals. Hosted on Render, it runs daily using Postman to keep the info up-to-date.

## Installation
1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Run the application**
   ```sh
   node app.js
   ```
## File structure
```
steam-game-data/
├── scrapers/
│   └── scraper.js      # All scraping and data handling logic
├── .env                       # Environment variables (e.g., database URL)
├── .gitignore                 # Ignore sensitive files in git
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation
```
## General rules
- File naming:
Names of files are always lowercase and do not use underescores.
If you need to use multiple words, use camelCase.

- Variables: 
Use camelCase for variables

- Asynchronous methods: 
Writing asynchronous code improves performance and should be used when possible. In particular, you can use promises and async/await.

## Workflow
In this project 4 kind of branches are being used. The main branch should only contain the code that can be shown if it had to be hosted.
The develop branch is the branch dedicated to the development of the code. Whenever a new feature is needed to be added, a new feature branch
is created out of the develop branch and merged back into it whenever the feature is finished. The last branch is the docs branch. This branch
serves as a branch where all the documentation will be done. The documentation will be updated whenever a feature is completly finished.

## Features
### Scraping:
The main feature of this app is scraping data from [Steamspy](https://steamspy.com/). The data will later be used to generate visual graphics of Steam games. I am using [Puppeteer](https://pptr.dev/) to automate the web scraping process. 
The data that is being extracted are:
- Game name
- Genres
- Tags
- Release data
- Price
- Owners
- Peak concurrent players (yesterday's stats)
This data is then structured and stored in a object in order to store it into a database.

### Storing data into database:
Once all the data is collected, the app will store the data into a [MongoDB](https://www.mongodb.com) database.
But before storing new data into the database, there are a few verifications to be done:
   1. Check if all fields are filled with data, if it doesn't it will skip to the next data record.
   2. Check if the data is a duplicate:
      - If it is not a duplicate, it will insert the new record into the database. 
      - If it is a duplicate, the app will check wether the data is up to date. If it is, it goes to the next record, if it is not the data record will be updated.

### Hosting application:
The application is hosted on [Render](https://dashboard.render.com/), which automatically builds and deploys the app using the ```./render-build.sh``` command. This script resolves the issue of Render not locating the Chromium browser required for Puppeteer to navigate and scrape data online. The solution was inspired by a response from the [Render community](https://community.render.com/t/error-could-not-found-chromium/9848/2).

The purpose of hosting the application is to automate the data scraping process. To achieve this, [Postman](https://www.postman.com/) is used to schedule daily calls to the scraping endpoint, ensuring regular data collection without manual intervention.

## Endpoints:
1. GET /getData
This endpoint start the scraping process. Once the data is collected, it is sent to the next endpoint, postData, for storage into the database.
This endpoint returns data as a JSON object.

2. POST /postData
This endpoint is responsible for storing the data scraped by the /getData endpoint into the database. 
The request body should be:
```
{
  "gameName": "string",
  "genres": ["string"],
  "tags": ["string"],
  "releaseDate": "YYYY-MM-DD",
  "price": "string",
  "owners": {
    "min": "number",
    "max": "number",
    "average": "number"
  },
  "playerPeak": {
    "players": "number",
    "date": "YYYY-MM-DD"
  }
}
```
This endpoint returns a 201 status when succesfully creating a new record into the database.
This endpoint returns a 200 status when succesfully updating an existing record into the database.

## Environment Variables
The following environment variables need to be set in a `.env` file:
- `MONGODB_URI`: Your MongoDB connection string.
- `BASE_URL`: The base URL of the website to scrape (e.g., SteamSpy).
- `PUPPETEER_EXECUTABLE_PATH`: The path to the Chromium executable (required for Puppeteer).


## Sources
- [Puppeteer](https://pptr.dev/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [MongoDB](https://www.mongodb.com)
- [Render](https://dashboard.render.com/)
- [Render community](https://community.render.com/t/error-could-not-found-chromium/9848/2)
- [Postman](https://www.postman.com/)


