import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    await mongoose.connect(uri)
    console.log("-----------------------------------------");
    console.log("Success! Connected to MongoDB Atlas");
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

connectDB();
dotenv.config();
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use(cors({
  origin: process.env.CLIENT_URL
}));

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB: besafe-db');
    return null; 
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });

app.use('/api/reports', reportRoutes)
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
