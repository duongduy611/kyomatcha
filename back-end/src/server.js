const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
const connectDB = require('./config/db');
const routes = require("./routes");


app.use(express.json());

app.use(cors({
    origin: 'https://kyomatcha-phi.vercel.app/',
    origin: 'https://kyomatcha-27kz1pmqh-zanhducs-projects.vercel.app/',// đổi theo domain thật
    credentials: true
  }));

// Serve static files from the front-end public directory
app.use('/assets', express.static(path.join(__dirname, '../../front-end/src/assets')));

// Kết nối MongoDB
connectDB();

//HTTP logger
app.use(morgan('combined'))

// Import router
app.use('/', routes);
const authRouter = require('./routes/authRoutes');
app.use('/api', authRouter);
const productRouter = require('./routes/product');
app.use('/api', productRouter);
const contactRouter = require('./routes/contactRouter');
app.use('/api', contactRouter);
const blogRouter = require('./routes/blogRoutes');
app.use('/api', blogRouter);
const favoriteRouter = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRouter);

const PORT = 9999;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
