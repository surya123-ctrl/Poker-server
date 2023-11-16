const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://suryatomar303:Surya123@cluster0.cujec2y.mongodb.net/?retryWrites=true&w=majority';
const app = express();
const { v1: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: "Hello" })
})


app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password } = req.body;
    //creating user by adding hash password and uuid
    const generatedUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await client.connect()
        const database = client.db('app-data');
        const users = database.collection('users');
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists, Please Login');
        }
        const sanitizedEmail = email.toLowerCase();
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }
        const insertedUser = await users.insertOne(data);
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        });
        res.status(201).json({ token, user_id: generatedUserId, email: sanitizedEmail });
    }
    catch (error) {
        console.log(error);
    }
})


app.get('/users', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');
        const returnedUsers = await users.find().toArray();
        res.send(returnedUsers);
    } finally {
        await client.close();
    }
})



app.listen(PORT, () => {
    console.log(`Server is running on port 8000`);
})