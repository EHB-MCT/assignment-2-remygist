import express from 'express';
import cors from 'cors';
import "dotenv/config";
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

client.connect().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.get('/fetchData', async (req, res) => {
    try {
        const collection = client.db("DEV5").collection("game-data");
        const gameData = await collection.find({}).toArray();
        res.status(200).send(gameData);
    } catch (error) {
        console.error('Error scraping game data: ', error);
        res.status(500).send('Error retrieving game data.')
    }
})

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})