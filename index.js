const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())
//mongodb database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dejzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const travelDataCollection = client.db('travelGuidePlus').collection('allServices')
        const bookingDataCollection = client.db('travelGuidePlus').collection('booking')


        //post tour place
        app.post('/addTourPlaces', async (req, res) => {
            const result = await travelDataCollection.insertOne(req.body)
            res.json(result)
        })
        //get all tour list
        app.get('/tourPlaces', async (req, res) => {
            const result = await travelDataCollection.find({}).toArray()
            res.json(result)
        })
        //get single tour
        app.get('/tourPlaces/:id', async (req, res) => {
            const query = req.params.id
            const result = await travelDataCollection.findOne({ _id: ObjectId(query) })
            res.json(result)
        })
        // post tour booking
        app.post('/tourBooking/', async (req, res) => {
            const query = req.body
            const result = await bookingDataCollection.insertOne(query)
            res.json(result);
        })
        //get single booking 
        app.get('/myOrders/:email', async (req, res) => {
            const result = await bookingDataCollection.find({ email: req.params.email }).toArray()
            res.json(result)
        })
        //get all booking for manage orders
        app.get('/manageOrders', async (req, res) => {
            const result = await bookingDataCollection.find({}).toArray()
            res.json(result)
        })

        // delete booked order
        app.delete('/delete/:id', async (req, res) => {
            const result = await bookingDataCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.json(result)
        })

        // approve booking
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const result = await bookingDataCollection.updateOne({ _id: ObjectId(id) }, {
                $set: {
                    status: 'Approved'
                }
            })
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Travel Guide+ server is running.')
})


app.listen(port, () => {
    console.log('Running server port at', port);
})