import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
    'http://localhost:5173',                    // Local frontend development
    'http://localhost:3000',                    // Local backend development
    'https://itnext-globalvisa-ai.pages.dev',   // Production frontend (Cloudflare Pages)
    'https://itnext-globalvisa.org',            // Production frontend (Custom domain)
];

// Helper to check if origin matches wildcard pattern
const isOriginAllowed = (origin: string, allowed: string) => {
    if (allowed === origin) return true;
    if (allowed.includes('*')) {
        const pattern = allowed.replace(/\./g, '\\.').replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(origin);
    }
    return false;
};

// Add explicit headers for Vercel - This must come BEFORE other middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;

    console.log(`[CORS] ${req.method} ${req.path} from origin: ${origin}`);

    // Determine if origin is allowed (more permissive for deployment)
    const isAllowed = !origin || // No origin (curl, etc.)
        allowedOrigins.some(allowed => isOriginAllowed(origin, allowed)) ||
        origin.endsWith('.pages.dev') ||
        origin.endsWith('.cloudflare.com') ||
        origin.includes('vercel.app'); // Allow vercel preview URLs

    if (isAllowed && origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests immediately
    if (req.method === 'OPTIONS') {
        console.log('[CORS] Preflight request handled');
        return res.status(204).end();
    }

    next();
});

app.use(cors({
    origin: true, // Accept all origins in the middleware layer
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import adminRoutes from './routes/adminRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

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
// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
