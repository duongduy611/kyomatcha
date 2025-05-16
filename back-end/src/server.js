const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./config/db');

app.use(express.json());
connectDB();

app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Welcome to Practical Exam!' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));