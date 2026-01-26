import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('ITNEXT GlobalVisa AI Backend is running');
});

// Test endpoint to verify connection
app.get('/api/test', (req, res) => {
    console.log('=== TEST ENDPOINT HIT ===');
    res.json({ success: true, message: 'Backend is responding!', timestamp: new Date().toISOString() });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
