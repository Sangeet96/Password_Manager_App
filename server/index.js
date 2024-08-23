const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = "mongodb+srv://Sangeet:Sangeet%4012345%24@cluster0.gcn1f.mongodb.net/cyberkey?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

const dbName = 'cyberkey';
const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://password-manager-app-frontend.vercel.app', // Your frontend's URL
  methods: ['GET', 'POST', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true
}));

app.use(express.json());

client.connect()
console.log('Connected successfully to server');

    // Get all passwords
    app.get('/', async (req, res) => {
      console.log("Hello");
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

module.exports = app;
