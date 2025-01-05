# Dataflow

## Data origin
The data is gathered from [SteamSpy](https://steamspy.com/), a site that aggregates data from games listed on [Steam](https://store.steampowered.com/), including details such as price, release date, genre, and player statistics. This application scrapes information from the DOM of various SteamSpy game pages. Once collected, the data is stored in a [MongoDB](https://www.mongodb.com) database.

## Data structure
The data is stored in the following format:

```
{ 
  "_id": {                              # Unique identifier created by MongoDB for each record.
    "$oid": "674c7476cbc2a679e41aab38"
  },
  "gameName": "Enigma of Fear",         # Name of the scraped game
  "genres": [                           # Genres tied to the game
    "Action",
    "Adventure",
    "Indie"
  ],
  "tags": [                             # Tags tied to the game
    "Mystery",
    "Investigation",
    "Supernatural",
    ...
  ],
  "releaseDate": "2024-11-28",          # Release date of the game
  "price": "$22.49",                    # Price of the game
  "owners": {                           # Estimation of amount of owners, the average is used for the graphs
    "min": 200000,
    "max": 500000,
    "average": 350000
  },
  "playerPeak": [                       # Amount of peak players per day
    {
      "players": 7140,
      "date": "2024-11-30"
    },
    {
      "players": 6404,
      "date": "2024-12-01"
    },
    {
      "players": 6067,
      "date": "2024-12-02"
    },
    ...
  ]
}
```


## Data Sorting
During the scraping process, the collected data undergoes the following verifications:

- All fields must be populated. If any field is null or missing, the game will be ignored, and the scraping process will move on to the next game.
- If all fields contain valid data, the following checks are performed:
  1. If the game is not already in the database, a new record is inserted.
  2. If the game already exists:
     - The "owners" field is updated with new data.
     - The player peak data is appended with the latest values.

## Visualizing the Data
The frontend fetches data from the database and sorts it for visualization. The data is transformed to fit the structure required for various graphs and charts. 
