import mongoose, { Schema, Document } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         - divingLvl
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           enum: [admin, manager, staff]
 *           description: The user's role
 *         divingLvl:
 *           type: number
 *           enum: [0, 1, 2, 3, 4, 5]
 *           description: The user's diving level
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: password123
 *         role: staff
 *         divingLvl: 3
 */

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'manager' | 'staff';
    divingLvl: 0| 1 | 2 | 3 | 4 | 5;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
    divingLvl: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true }
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };