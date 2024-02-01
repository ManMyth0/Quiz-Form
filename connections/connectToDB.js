// housing the function to connect to the mongoDB and returning information to use elsewhere if wanted / needed

require('dotenv').config();
const { MongoClient } = require("mongodb");

async function connectToMongoDB() {
    try 
    {
        // replace URI, database and collection with your own
        const URI = process.env.URI;
        const client = new MongoClient( URI );
        const database = client.db("Replace with your own MongoDB Cluster");
        const collection = database.collection("Replace  with your own Collection");

        // connect to mongoDB
        await client.connect();

        // console.log('Connected to MongoDB!');

        // so far only the collection variable is required as dynamic integration
        // just incase we want to use the other variables elsewhere, we return the rest for use:
        return { client, database, collection };
    } 
    
    catch (error) 
    {
        console.log('There was an error connecting to the Database!:', error);
    }
}

module.exports = { connectToMongoDB };
