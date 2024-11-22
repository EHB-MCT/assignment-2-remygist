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

## Node.js conventions



