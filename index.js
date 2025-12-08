// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());

// ⚠️ Stripe webhook needs raw body, so don't use express.json() for it
app.use(express.json());

// MongoDB setup
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qswuexk.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let loanApplicationsCollection;

// Connect to MongoDB
async function run() {
    try {
        await client.connect();
        console.log("MongoDB connected ✅");

        const db = client.db("LoanLinkDB");
        loanApplicationsCollection = db.collection("loanApplications");

    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
run().catch(console.error);

// --- Routes ---

// Test route
app.get('/', (req, res) => {
    res.send('LoanLink server is running 🚀');
});

// Get all loans for a user
app.get('/my-loans', async (req, res) => {
    const userEmail = req.query.email;
    if (!userEmail) return res.status(400).json({ message: "Email query required" });

    try {
        const loans = await loanApplicationsCollection
            .find({ userEmail })
            .sort({ appliedAt: -1 })
            .toArray();
        res.json(loans);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching loans" });
    }
});

// Submit a loan application
app.post('/loan-applications', async (req, res) => {
    const application = req.body;
    if (!application.userEmail || !application.loanAmount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const finalApp = {
            ...application,
            status: application.status || "Pending",
            applicationFeeStatus: application.applicationFeeStatus || "Unpaid",
            appliedAt: new Date()
        };
        const result = await loanApplicationsCollection.insertOne(finalApp);
        res.status(201).json({ message: "Loan application submitted", insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error submitting loan" });
    }
});

// Delete loan application
app.delete('/loan-applications/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid loan ID" });

    try {
        const result = await loanApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Loan not found" });
        res.json({ message: "Loan deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting loan" });
    }
});

// Create Stripe payment session
app.post('/create-payment-session', async (req, res) => {
    const { userEmail, loanId } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: 'Loan Application Fee' },
                unit_amount: 1000, // $10
            },
            quantity: 1,
        }],
        mode: 'payment',
        customer_email: userEmail,
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/my-loans?success=false`,
        metadata: { loanId: loanId.toString() },
    });

    res.send({ url: session.url });
});

app.patch('/payment-success', async (req, res) => {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('session retrieved', session);
    if (session.payment_status === 'paid') {
        const id = session.metadata.loanId;
        const query = { _id: new ObjectId(id) };
        const Update = {
            $set: {
                applicationFeeStatus: "Paid",

            }
        }
        const result = await loanApplicationsCollection.updateOne(query, Update);
        res.send(result)
    }
    res.send({ success: false })
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port} 🚀`);
});
