const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = "mongodb+srv://Sangeet:Sangeet%4012345%24@sangeet.gcn1f.mongodb.net/cyberkey?retryWrites=true&w=majority&appName=Sangeet";
const client = new MongoClient(url);

const dbName = 'cyberkey';
const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://password-manager-app-client.vercel.app', // Allow requests from your frontend
}));

client.connect()
  .then(() => {
    console.log('Connected successfully to server');

    // Get all passwords
    app.get('/', async (req, res) => {
      const db = client.db(dbName);
      const collection = db.collection('passwords');
      const findResult = await collection.find({}).toArray();
      res.json(findResult);
    });

    // Save password
    app.post('/', async (req, res) => {
      const password = req.body;
      const db = client.db(dbName);
      const collection = db.collection('passwords');
      const result = await collection.insertOne(password);
      res.json({ success: true, result });
    });

    // Delete password
    app.delete('/', async (req, res) => {
      const password = req.body;
      const db = client.db(dbName);
      const collection = db.collection('passwords');
      const result = await collection.deleteOne(password);
      res.json({ success: true, result });
    });

    // Only start the server if MongoDB connects successfully
    module.exports = app; // Export the app for Vercel
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
