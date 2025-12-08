const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000
const { ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qswuexk.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // 1. Establish connection to MongoDB Atlas
        await client.connect();

        // --- Database & Collection Setup ---
        const db = client.db("LoanLinkDB");
        const loansCollection = db.collection("loans");
        const usersCollection = db.collection("users");

        console.log("Pinged your deployment. You successfully connected to MongoDB! 🟢");

        // 2. Define API Routes that use the open connection
        app.get('/loans', async (req, res) => {
            try {
                // The connection is now open when this is called
                const loans = await loansCollection.find().toArray();
                res.json(loans);
            } catch (err) {
                console.error("Error fetching loans:", err);
                res.status(500).json({ message: 'Server error fetching data' });
            }
        });

        app.get('/loans/:id', async (req, res) => {
            const { id } = req.params;

            try {
                // Convert string ID to Mongo ObjectId
                const loan = await loansCollection.findOne({ _id: new ObjectId(id) });

                if (!loan) {
                    return res.status(404).json({ message: 'Loan not found' });
                }

                res.json(loan);
            } catch (err) {
                console.error('Error fetching loan:', err);
                res.status(500).json({ message: 'Server error fetching loan' });
            }
        });


        // user save api

        // Ping to confirm connection (Optional, but good practice)
        await client.db("admin").command({ ping: 1 });

    } catch (error) {
        // Log any connection errors
        console.error("Failed to connect to MongoDB:", error);
    }

    // --- IMPORTANT CHANGE ---
    // The finally block is now removed, keeping the client open.
    // If the server shuts down, the connection will naturally close.
}

run().catch(console.dir);

// --- General Express Routes ---
app.get('/', (req, res) => {
    res.send('loanLink is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port} 🚀`)
})