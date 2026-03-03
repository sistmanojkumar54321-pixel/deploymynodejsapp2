const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());

let db, users;

// Global connection cache for Vercel
let cachedClient = null;
let cachedDb = null;

async function connectDB() {
    // Return cached connection if exists
    if (cachedClient && cachedDb) {
        db = cachedDb;
        users = db.collection('users');
        return;
    }

        const uri = "mongodb+srv://manoj:password1234@cluster0.qubf9fy.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    
    await client.connect();
    console.log("Connected to MongoDB!");
    
    db = client.db('userdb');
    users = db.collection('users');
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
}

connectDB();

app.get('/test', (req, res) => {
    res.json({name: 'Bharath'});
});

app.get('/users', async (req, res) => {
    await connectDB();
    const allUsers = await users.find({}).toArray();
    res.json(allUsers);
});

app.post('/users', async (req, res) => {
    await connectDB();
    const result = await users.insertOne(req.body);
    res.json({message: 'User created', id: result.insertedId});
});

app.put('/users/:id', async (req, res) => {
    await connectDB();
    await users.updateOne(
        {_id: new ObjectId(req.params.id)}, 
        {$set: req.body}
    );
    res.json({message: 'User updated'});
});

app.delete('/users/:id', async (req, res) => {
    await connectDB();
    await users.deleteOne({_id: new ObjectId(req.params.id)});
    res.json({message: 'User deleted'});
});

app.get('/users/:id', async (req, res) => {
    await connectDB();
    const user = await users.findOne({_id: new ObjectId(req.params.id)});
    res.json(user);
});

app.get('/search', async (req, res) => {
    await connectDB();
    const name = req.query.name;
    const result = await users.find({
        name: new RegExp(name, 'i')
    }).toArray();
    res.json(result);
});

app.listen(3000, () => {
    console.log(`🚀 Server running on port 3000`);
});


