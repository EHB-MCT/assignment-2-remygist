# Steam game data


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
├── config/
│   └── db.js                  # Database connection setup
├── scrapers/
│   └── scraper.js      # All scraping and data handling logic
├── .env                       # Environment variables (e.g., database URL)
├── .gitignore                 # Ignore sensitive files in git
├── app.js                     # Main application entry point
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
- Scraping:
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

## Sources
- [Puppeteer](https://pptr.dev/)
- [dotenv](https://www.npmjs.com/package/dotenv)


