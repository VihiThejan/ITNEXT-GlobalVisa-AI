import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@itnext.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('Admin@123', 12);
        const adminUser = new User({
            email: 'admin@itnext.com',
            password: hashedPassword,
            fullName: 'ITNEXT Administrator',
            provider: 'email',
            role: 'admin',
            isVerified: true,
            assessmentHistory: [],
            profile: {}
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@itnext.com');
        console.log('🔑 Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
