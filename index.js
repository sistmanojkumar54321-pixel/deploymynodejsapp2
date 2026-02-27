const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');


const app = express();
app.use(express.json());

let db, users;

async function connectDB() {
    const uri = "mongodb+srv://bharath:password1234@cluster0.tlwgfmy.mongodb.net/?appName=Cluster0";
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
}

connectDB();

app.get('/test', (req, res) => {
    res.json({name: 'Bharath'});
});

app.get('/users', async (req, res) => {
    const allUsers = await users.find({}).toArray();
    res.json(allUsers);
});

app.post('/users', async (req, res) => {
    const result = await users.insertOne(req.body);
    res.json({message: 'User created', id: result.insertedId});
});

app.put('/users/:id', async (req, res) => {
    await users.updateOne(
        {_id: new ObjectId(req.params.id)}, 
        {$set: req.body}
    );
    res.json({message: 'User updated'});
});

app.delete('/users/:id', async (req, res) => {
    await users.deleteOne({_id: new ObjectId(req.params.id)});
    res.json({message: 'User deleted'});
});

app.get('/users/:id', async (req, res) => {
    const user = await users.findOne({_id: new ObjectId(req.params.id)});
    res.json(user);
});

app.get('/search', async (req, res) => {
    const name = req.query.name;
    const result = await users.find({
        name: new RegExp(name, 'i')
    }).toArray();
    res.json(result);
});



app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});


