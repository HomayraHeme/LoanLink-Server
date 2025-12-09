// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

const admin = require("firebase-admin");

const serviceAccount = require("./loanlink-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const app = express();
const port = process.env.PORT || 3000;

// --- Utility Functions ---

function generateTrackingId() {
    const prefix = 'LOANLINK';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character random
    return `${prefix}-${date}-${random}`;
}

// --- Custom Middleware ---

const verifyFBToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "unauthorized access" })
    }
    try {
        const idToken = token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        console.log('decoded in the token', decoded);
        req.decoded_email = decoded.email;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: "unauthorized access" })
    }
    console.log('headers', req.headers.authorization);

}
// --- Middleware Setup ---
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qswuexk.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let loanApplicationsCollection;
let loansCollection;
let usersCollection;
let managerCollection;

// Connect to MongoDB
async function run() {
    try {
        await client.connect();
        console.log("MongoDB connected ✅");

        const db = client.db("LoanLinkDB");
        loanApplicationsCollection = db.collection("loanApplications");
        loansCollection = db.collection("loans");
        usersCollection = db.collection("users");
        managerCollection = db.collection("managers");


    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
run().catch(console.error);


app.get('/', (req, res) => {
    res.send('LoanLink server is running 🚀');
});


// user api
app.post('/users', async (req, res) => {
    const user = req.body;
    user.role = 'borrower'; // default role
    user.createdAt = new Date();
    const email = user.email;
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
        return res.send({ message: "User already exists" });
    }

    const result = await usersCollection.insertOne(user);
    res.send(result);
});


app.get('/users/:email', verifyFBToken, async (req, res) => {
    const email = req.params.email;

    if (req.decoded_email !== email) {
        return res.status(403).send({ message: "Forbidden: Email mismatch" });
    }

    try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User profile data not found in DB" });
        }
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching user" });
    }
});

// Get all available loans
app.get('/loans', async (req, res) => {
    try {
        const loans = await loansCollection.find().toArray();
        res.status(200).json(loans);
    } catch (err) {
        console.error("Error fetching loans:", err);
        res.status(500).json({ message: "Server error fetching loans" });
    }
});

// Get single loan by ID
app.get('/loans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid loan ID format" });

        const loan = await loansCollection.findOne({ _id: new ObjectId(id) });

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        res.status(200).json(loan);
    } catch (err) {
        console.error("Error fetching loan:", err);
        res.status(500).json({ message: "Server error fetching loan" });
    }
});


// Get all loans for a user (Protected route)
app.get('/my-loans', verifyFBToken, async (req, res) => {
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

    if (!userEmail || !loanId) return res.status(400).json({ message: "Missing required fields" });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Loan Application Fee' },
                    unit_amount: 1000, // $10.00
                },
                quantity: 1,
            }],
            mode: 'payment',
            customer_email: userEmail,
            // Client-side fulfillment redirect (as requested)
            success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_DOMAIN}/dashboard/my-loans?success=false`,
            metadata: { loanId: loanId.toString() },
        });

        res.send({ url: session.url });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ message: "Error creating payment session" });
    }
});

// ⚠️ Unsafe Client-Side Payment Fulfillment Route
app.patch('/payment-success', async (req, res) => {
    const { session_id } = req.query;

    let session;
    try {
        // Retrieve the full session details
        session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (err) {
        console.error("Error retrieving Stripe session:", err);
        return res.status(500).send({ success: false, message: "Error retrieving session" });
    }

    console.log('Session retrieved successfully:', session.id);

    if (session.payment_status === 'paid') {

        // ✅ Get Transaction ID (Payment Intent ID)
        const transactionId = session.payment_intent;

        const id = session.metadata.loanId;
        const query = { _id: new ObjectId(id) };
        const Update = {
            $set: {
                applicationFeeStatus: "Paid",
                transactionId: transactionId, // Store the payment intent ID
                trackingId: generateTrackingId() // Store the generated tracking ID
            }
        }

        try {
            const result = await loanApplicationsCollection.updateOne(query, Update);
            // In case of error, you might want to return an error status here.
            res.send(result)
        } catch (dbErr) {
            console.error("Database update error on payment success:", dbErr);
            res.status(500).send({ success: false, message: "Database update failed" });
        }
    } else {
        res.send({ success: false, message: "Payment not yet paid or status unknown" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port} 🚀`);
});