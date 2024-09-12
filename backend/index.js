const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();


app.use(cors({ origin: '*' }));

app.use(express.json());


app.use((req, res, next) => {
  console.log('Incoming Request URL:', decodeURIComponent(req.url));
  next();
});


const connectDB = require('./db');
connectDB();


const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);


const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
