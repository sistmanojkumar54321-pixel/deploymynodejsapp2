const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());

// Global connection variable
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    // Return cached connection if exists
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = "mongodb+srv://bharath:password1234@cluster0.tlwgfmy.mongodb.net/?appName=Cluster0";
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
    });

    await client.connect();
    console.log("Connected to MongoDB!");
    
    const db = client.db('userdb');
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
}

app.get('/test', (req, res) => {
    res.json({name: 'Bharath'});
});

app.get('/users', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const allUsers = await users.find({}).toArray();
        res.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({error: 'Failed to fetch users', details: error.message});
    }
});

app.post('/users', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const result = await users.insertOne(req.body);
        res.json({message: 'User created', id: result.insertedId});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Failed to create user', details: error.message});
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        await users.updateOne(
            {_id: new ObjectId(req.params.id)}, 
            {$set: req.body}
        );
        res.json({message: 'User updated'});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({error: 'Failed to update user', details: error.message});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        await users.deleteOne({_id: new ObjectId(req.params.id)});
        res.json({message: 'User deleted'});
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({error: 'Failed to delete user', details: error.message});
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const user = await users.findOne({_id: new ObjectId(req.params.id)});
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({error: 'Failed to fetch user', details: error.message});
    }
});

app.get('/search', async (req, res) => {
    try {
        const name = req.query.name;
        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const result = await users.find({
            name: new RegExp(name, 'i')
        }).toArray();
        res.json(result);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({error: 'Failed to search users', details: error.message});
    }
});



app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});


