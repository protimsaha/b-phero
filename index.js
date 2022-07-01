const express = require('express');
const cors = require('cors');
const app = express()
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
require('dotenv').config()


app.use(cors())
app.use(express.json())


var MongoClient = require('mongodb').MongoClient;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.nh8cc.mongodb.net:27017,cluster0-shard-00-01.nh8cc.mongodb.net:27017,cluster0-shard-00-02.nh8cc.mongodb.net:27017/?ssl=true&replicaSet=atlas-1089r9-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, function (err, client) {

    async function run() {
        try {
            await client.connect()
            const billCollection = client.db('pHero').collection('bill')


            app.post('/billing-list', async (req, res) => {
                const data = req.body;
                const result = await billCollection.insertOne(data)
                res.send(result)
            })

            app.get('/billing-list/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const bill = await billCollection.findOne(query)
                res.send(bill)
            })
            app.get('/billing-list', async (req, res) => {
                const bills = await billCollection.find({}).toArray()
                res.send(bills)
            })

            app.put('/update-billing/:id', async (req, res) => {
                const id = req.params.id;
                const body = req.body;
                const filter = { _id: ObjectId(id) };
                const updateDoc = {
                    $set: {
                        name: body.name,
                        email: body.email,
                        phone: body.phone,
                        amount: body.amount,
                    }
                }
                const result = await billCollection.updateOne(filter, updateDoc);
                res.send(result)
            })
            app.delete('/delete-billing/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const result = await billCollection.deleteOne(query)
                res.send(result)
            })

        } finally { }

    }

    run().catch(console.dir)
});

app.get('/', (req, res) => {
    res.send('server is running')
})
app.listen(port, () => {
    console.log('Server is running at', port)
})