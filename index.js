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
        const loanApplicationsCollection = db.collection("loanApplications");

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


        app.post('/loan-applications', async (req, res) => {
            const applicationData = req.body;

            // Basic validation check (optional, but recommended)
            if (!applicationData.userEmail || !applicationData.loanAmount) {
                return res.status(400).json({ message: "Missing required application fields." });
            }


            try {
                // Ensure default status values are set if not provided by frontend
                const finalApplication = {
                    ...applicationData,
                    status: applicationData.status || 'Pending',
                    applicationFeeStatus: applicationData.applicationFeeStatus || 'Unpaid',
                    appliedAt: new Date()
                };

                const result = await loanApplicationsCollection.insertOne(finalApplication);

                res.status(201).json({
                    message: 'Loan application submitted successfully!',
                    insertedId: result.insertedId
                });
            } catch (error) {
                console.error('Error submitting loan application:', error);
                res.status(500).json({ message: 'Server error processing application submission.' });
            }
        });

        app.get('/loan-applications', async (req, res) => {
            const userEmail = req.query.email;

            if (!userEmail) {
                return res.status(400).json({ message: "Email query parameter is required." });
            }

            try {
                const applications = await loanApplicationsCollection.find({ userEmail: userEmail }).toArray();
                res.json(applications);
            } catch (err) {
                console.error("Error fetching user applications:", err);
                res.status(500).json({ message: 'Server error fetching user applications' });
            }
        });


        // 🧾 Get All Loan Applications for a Specific User
        app.get('/my-loans', async (req, res) => {
            const userEmail = req.query.email;

            if (!userEmail) {
                return res.status(400).json({ message: "Email query parameter is required." });
            }

            try {
                const myLoans = await loanApplicationsCollection
                    .find({ userEmail: userEmail })
                    .sort({ appliedAt: -1 }) // newest first
                    .toArray();

                res.json(myLoans);
            } catch (err) {
                console.error("Error fetching my loans:", err);
                res.status(500).json({ message: "Server error fetching loans." });
            }
        });

        app.delete('/loan-applications/:id', async (req, res) => {
            const loanId = req.params.id;

            if (!ObjectId.isValid(loanId)) {
                return res.status(400).json({ error: 'Invalid loan ID' });
            }

            try {
                const result = await loanApplicationsCollection.deleteOne({ _id: new ObjectId(loanId) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Loan not found' });
                }

                res.status(200).json({ message: 'Loan deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });








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