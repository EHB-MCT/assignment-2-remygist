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

- Storing data into database:
Once all the data is collected, the app will store the data into a [MongoDB](https://www.mongodb.com) database.
But before storing new data into the database, there are a few verifications to be done:
   1. Check if all fields are filled with data, if it doesn't it will skip to the next data record.
   2. Check if the data is a duplicate:
      - If it is not a duplicate, it will insert the new record into the database. 
      - If it is a duplicate, the app will check wether the data is up to date. If it is, it goes to the next record, if it is not the data record will be updated.

## Sources
- [Puppeteer](https://pptr.dev/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [MongoDB](https://www.mongodb.com)


