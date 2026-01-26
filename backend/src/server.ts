import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
    'http://localhost:5173',  // Local frontend development
    'https://itnext-globalvisa-ai.pages.dev',  // Production frontend (Cloudflare Pages)
    'https://*.pages.dev'  // Allow any Cloudflare Pages preview deployments
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list or matches wildcard
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                const pattern = allowed.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import adminRoutes from './routes/adminRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

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
