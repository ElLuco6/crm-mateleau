import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });

    return { token, userId: user._id, role: user.role };
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, secretKey) as JwtPayload;
};