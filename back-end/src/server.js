const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const connectDB = require('./config/db');
const routes = require("./routes");


app.use(express.json());
app.use(cors());

// Kết nối MongoDB
connectDB();

//HTTP logger
app.use(morgan('combined'))

// Import router
app.use('/', routes);

const PORT = 9999;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));