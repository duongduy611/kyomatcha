const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/KyoMatcha');

// Import router
const authRouter = require('./routes/authRoutes');
app.use('/api', authRouter);

const PORT = 9999;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));