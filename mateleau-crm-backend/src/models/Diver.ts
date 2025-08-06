import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Diver:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - divingLvl
 *         - age
 *         - phone
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *           description: The diver's first name
 *         lastName:
 *           type: string
 *           description: The diver's last name
 *         divingLvl:
 *           type: number
 *           enum: [0, 1, 2, 3, 4, 5]
 *           description: The diver's diving level
 *         age:
 *           type: number
 *           description: The diver's age
 *         phone:
 *           type: string
 *           description: The diver's phone number
 *         email:
 *           type: string
 *           description: The diver's email
 *         additionalInfo:
 *           type: string
 *           description: Additional information about the diver
 *        
 *       example:
 *         firstName: Jane
 *         lastName: Doe
 *         divingLvl: 2
 *         age: 25
 *         phone: +1234567890
 *         email: jane.doe@example.com
 *         additionalInfo: Experienced diver
 *         
 */

interface IDiver extends Document {
    firstName: string;
    lastName: string;
    divingLvl: 0 | 1 | 2 | 3 | 4 | 5;
    age: number;
    phone: string;
    email: string;
    additionalInfo?: string;
   
}

const DiverSchema: Schema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    divingLvl: { type: Number, required: true, enum: [0, 1, 2, 3, 4, 5] },
    age: { type: Number, required: true, min: 18 },
    phone: { type: String, required: true, validate: /^\+?[0-9]{7,15}$/ },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    additionalInfo: { type: String, default: '' },
   
});

// Exporter le modèle
const Diver = mongoose.model<IDiver>('Diver', DiverSchema);

export { Diver, IDiver };