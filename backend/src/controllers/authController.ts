import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Request body:', req.body);

    try {
        const { email, password, fullName, provider, avatar } = req.body;
        console.log('Extracted fields:', { email, fullName, provider });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            provider: provider || 'email',
            avatar,
            isVerified: provider === 'google' // Auto verify google users
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(201).json({ result: newUser, token });
    } catch (error) {
        console.error('=== REGISTRATION ERROR ===');
        console.error('Error:', error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : String(error) });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (existingUser.provider === 'email' && password) {
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password!);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
