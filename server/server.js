import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/rubberDucks.js'; // Import the routes
import mongoose from 'mongoose';
import reportRoutes from './routes/reportRoutes.js';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images
app.use('/uploads', express.static('uploads'));


app.use(cors({
  origin: process.env.CLIENT_URL
}));

// Use the routes file for all `/ducks` routes
app.use('/ducks', rubberDuckRoutes);


// Start server
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
