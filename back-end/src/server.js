const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./config/db');
const routes = require("./routes");

//connect db
connectDB();

//middleware
app.use(express.json());


// use routes
app.use("/", routes);


const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));