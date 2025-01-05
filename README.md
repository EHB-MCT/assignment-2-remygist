# Steam game data
Steam Game Data Scraper is a tool that collects and stores data about Steam games automatically. It uses Puppeteer to scrape info like game names, genres, tags, release dates, prices, ownership stats, and player counts from SteamSpy. The data is saved in a MongoDB database and is visualized using interactive charts created with Chart.js. These visuals include genre distributions, popular tags, and price ranges, providing actionable insights for analysis. Hosted on Render, it runs daily using Postman to keep the info up-to-date.

## Installation
### Front-end 
1. **Clone the repository**
2. **Move to public directory**
   ```sh
   cd public
   ```
3. **Install dependencies**
   ```sh
   npm install
   ```
4. **Run the application**
   ```sh
   npm run dev
   ```

### Back-end (optional: application is hosted on Render)
1. **Clone the repository**
2. **Move to scraper directory**
   ```sh
   cd scraper
   ```
3. **Install dependencies**
   ```sh
   npm install
   ```
4. **Run the application**
   ```sh
   node scraper.js
   ```

## File structure
```
steam-game-data/
├──public/
│   └──charts/          # Functions to create the different kind of charts
│   └──data/            # Functions that count and transforms the collected data
│   └──scripts/         # Contains index.js and api.js
│   └──styles/          # Contains styling files
├── scraper/
│   └── scraper.js      # All scraping and data handling logic
├── server/
│   └── server.js       # Fetches data from the database to show in the graphs
├── .env                       # Environment variables (e.g., database URL)
├── .gitignore                 # Ignore sensitive files in git
├── package.json               # Project metadata and dependencies
├── render-build.sh            # Script for running application on Render properly
└── README.md                  # Project documentation
└── DATAFLOW.md                # Collected data documentation
```
## General rules
- File naming:
Names of files are always lowercase and do not use underescores.
If you need to use multiple words, use camelCase. 

- Variables and functions naming:
Use camelCase for variables and functions.
Use descriptive nouns and verbs as prefixes for functions. (getName, postData)

- Asynchronous methods: 
Writing asynchronous code improves performance and should be used when possible. In particular, you can use promises and async/await.

- Statement rules:
1. Put the opening bracket at the end of the first line.
2. Use one space before the opening bracket.
3. Put the closing bracket on a new line, without leading spaces.
4. Do not end a complex statement with a semicolon. <br>
Example:
```
function toCelsius(fahrenheit) {
  return (5 / 9) * (fahrenheit - 32);
}
```

## Workflow
In this project 4 kind of branches are being used. The main branch should only contain the code that can be shown if it had to be hosted.
The develop branch is the branch dedicated to the development of the code. Whenever a new feature is needed to be added, a new feature branch
is created out of the develop branch and merged back into it whenever the feature is finished. The last branch is the docs branch. This branch
serves as a branch where all the documentation will be done. The documentation will be updated whenever a feature is completly finished.

## System architecture
The Steam Game Data Scraper operates through the following interconnected components:
1. Scraper module:
  - Function: Uses Puppeteer to scrape game data (e.g., names, genres, tags) from SteamSpy.
  - Output: Stores collected data in a structured format (JavaScript objects).
2. Data verification and storage:
  - Function: Validates scraped data for completeness and checks for duplicates before inserting or updating records in MongoDB.
  - Key verifications:
    - All fields are filled
    - Existing records are checked for up-to-date information
3. Server Module:
  - Function: Provides endpoints to fetch and manipulate data for visualization.
  - Endpoints:
    - ```/getData```: Initiates scraping
    - ```/postData```: Saves or updates data in the database
    - ```/fetchData```: Collects data from the database to use in the charts
4. Visualization Module:
  - Function: Converts stored data into interactive charts using Chart.js.
5. Automation:
  - Function: Ensures daily updates using Postman to call the scraping endpoint automatically. A cron-job on [cron-job](https://cron-job.org/en/) has also been set in place to execute at a different time of the day in case that the applications encounters an error with Postman.
6. Hosting and deployment:
  - Function: Hosted on Render for seamless execution of daily tasks and real-time data availability.

## SOLID Principles
### Single Responsibility Principle (SRP)
Each module in the application has a distinc responsibility:
- Scraper module: Handles data collection
- Server module: Manages data retrieval
- Visualisation module: Focuses on transforming data into visual representations

### Open/Closed Principle (OCP)
The application is designed to allow extensions without modifying existing code:
- New scraping rules or additional data fields can be added by extending the scraper.js logic without altering its core functionality.
- Additional visualizations can be introduced by creating new chart functions in the charts/ directory.

### Liskov Substitution Principle (LSP)
The design ensures interchangeable components:
- For example, the scraper module could be swapped out with another data source (e.g., a Steam API) as long as it adheres to the expected input/output structure.

### Interface Segregation Principle (ISP)
Each module and endpoint exposes only what is necessary:
- The server module provides specific endpoints for scraping (/getData), data storage (/postData) and retrieving data (/fetchData), preventing unnecessary or unrelated functionalities.

### Dependency Inversion Principle (DIP)
High-level modules are not tightly coupled to low-level details:
- The scraper depends on Puppeteer, but another scraping library could replace Puppeteer without significant changes.
- The database module relies on MongoDB, but could switch to a different database system if required.

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

### Data verification:
Once all the data is collected, the app will store the data into a [MongoDB](https://www.mongodb.com) database.
But before storing new data into the database, there are a few verifications to be done:
   1. Check if all fields are filled with data, if it doesn't it will skip to the next data record.
   2. Check if the data is a duplicate:
      - If it is not a duplicate, it will insert the new record into the database. 
      - If it is a duplicate, the app will check wether the data is up to date. If it is, it goes to the next record, if it is not the data record will be updated.
Take a look at the DATAFLOW.md file for further details.

### Hosting application:
The application is hosted on [Render](https://dashboard.render.com/), which automatically builds and deploys the app using the ```./render-build.sh``` command. This script resolves the issue of Render not locating the Chromium browser required for Puppeteer to navigate and scrape data online. The solution was inspired by a response from the [Render community](https://community.render.com/t/error-could-not-found-chromium/9848/2).

The purpose of hosting the application is to automate the data scraping process. To achieve this, [Postman](https://www.postman.com/) is used to schedule daily calls to the scraping endpoint, ensuring regular data collection without manual intervention.

### Data visualization:
The app uses [Chart.js](https://www.chartjs.org/) to create interactive graphs for visualizing the scraped data. 
1. Bar Chart: Most Popular Game Genres
 - Purpose: Displays the most frequent game genres, helping users identify trends in game development and preferences.
2. Bar Chart: Most Popular Game Tags
 - Purpose: Highlights the most used descriptive tags for games, offering insights into popular themes and mechanics.
3. Bar Chart: Price Distribution of Games
 - Purpose: Shows the distribution of game prices, revealing pricing trends and affordability in the market.
4. Horizontal Bar Chart: Top 3 Games by Peak Players
 - Purpose: Displays the top three games with the highest concurrent players at their peak.^
5. Bar Chart: Most Owned Games
 - Purpose: Highlights games with the highest ownership stats.
6. Stacked Column Chart: Top Tags by Genre
 - Purpose: Illustrates the relationship between game tags and genres, showing how tags are distributed across different genres. <br>
These visualizations were chosen to balance clarity, accessibility, and the ability to convey insights effectively.

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
- [Cron-job](https://cron-job.org/en/)
- [Chart.js](https://www.chartjs.org/)
- [License](https://choosealicense.com/licenses/mit/)
- [JS naming conventions](https://www.w3schools.com/js/js_conventions.asp)
- [JS naming conventions](https://www.syncfusion.com/blogs/post/top-javascript-naming-convention)
- [SOLID principles](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)
- [ChatGPT|debugging](https://chatgpt.com/share/677a7ceb-fd50-8007-b55e-a5841e94ed5a)
- [ChatGPT|ideas for graphs](https://chatgpt.com/share/677a7d04-ca6c-8007-92b1-756c8e71c443)
- [ChatGPT|used documentation](https://chatgpt.com/share/677a7d28-fa3c-8007-960a-7f38354438f2)
- [ChatGPT|coding along](https://chatgpt.com/share/677a7d70-88e0-8007-9fbb-039b42778396)


