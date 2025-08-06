import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import { IDiver } from './Diver';
import { IUser } from './User';
import { IEquipment } from './Equipment';

/**
 * @swagger
 * components:
 *   schemas:
 *     DivingGroup:
 *       type: object
 *       required:
 *         - guide
 *         - divers
 *         - groupSize
 *       properties:
 *         guide:
 *           type: string
 *           description: The ID of the guide (User)
 *         divers:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of diver IDs
 *         rentedEquipment:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               diverId:
 *                 type: string
 *                 description: The ID of the diver
 *               equipmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Array of equipment IDs
 *         groupSize:
 *           type: number
 *           description: The size of the group
 *       example:
 *         guide: 60d0fe4f5311236168a109ca
 *         divers: ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 *         rentedEquipment: [
 *           {
 *             diverId: "60d0fe4f5311236168a109cb",
 *             equipmentIds: ["676976de9096065fb09213da", "676976de9096065fb09213db"]
 *           }
 *         ]
 *         groupSize: 3
 */

interface IDivingGroup extends Document {
    guide: mongoose.Types.ObjectId | IUser; // Référence au guide
    divers: (mongoose.Types.ObjectId | IDiver)[]; // Références aux divers
    rentedEquipment: {
        diverId: mongoose.Types.ObjectId | IDiver;
        equipmentIds: mongoose.Types.ObjectId[] | IEquipment[];
    }[]; // Équipements loués par plongeur
    groupSize: number; // Taille calculée du groupe
}

const DivingGroupSchema: Schema = new Schema({
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    divers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Diver',
            required: true,
        },
    ],
    rentedEquipment: [
        {
            diverId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Diver',
                required: true,
            },
            equipmentIds: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Equipment',
                    required: true,
                },
            ],
        },
    ],
    groupSize: {
        type: Number
    },
});

// Middleware pour calculer la taille du groupe avant de sauvegarder
DivingGroupSchema.pre<IDivingGroup>('save', function (next) {
    this.groupSize = this.divers.length + 1; // Guide + divers
    if (this.groupSize > 5) {
        return next(new Error('Group size cannot exceed 5 members (including the guide).'));
    }

    // Check for duplicate divers
    const diversSet = new Set(this.divers.map(diver => diver.toString()));
    if (diversSet.size !== this.divers.length) {
        return next(new Error('Divers must be unique within the group.'));
    }

    next();
});

// Middleware pour vérifier les contraintes d'équipement avant de sauvegarder
DivingGroupSchema.pre<IDivingGroup>('save', async function (next: (err?: CallbackError) => void) {
    try {
        const rentedEquipmentSet = new Set();

        for (const assignment of this.rentedEquipment) {
            for (const equipmentId of assignment.equipmentIds) {
                const equipment = await mongoose.model('Equipment').findById(equipmentId);
                if (!equipment) {
                    return next(new Error(`Equipment with ID ${equipmentId} not found`));
                }
                if (rentedEquipmentSet.has(equipment.nature)) {
                    return next(new Error(`Equipment of nature ${equipment.nature} is already rented by another diver in this group.`));
                }
                rentedEquipmentSet.add(equipment.nature);
            }
        }

        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

const DivingGroup = mongoose.model<IDivingGroup>('DivingGroup', DivingGroupSchema);

export { DivingGroup, IDivingGroup };