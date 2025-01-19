import mongoose, { Schema, Document } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - nature
 *         - reference
 *         - nextMaintenanceDate
 *         - isRented
 *       properties:
 *         nature:
 *           type: string
 *           enum: ["combinaison", "detendeur", "bouteille", "masque", "tuba", "palme", "ordinateur", "lampe", "video", "ponny"]
 *           description: The nature of the equipment
 *         size:
 *           type: string
 *           description: The size of the equipment (optional)
 *         reference:
 *           type: string
 *           description: The unique reference for each type of equipment
 *         nextMaintenanceDate:
 *           type: string
 *           format: date
 *           description: The date of the next maintenance
 *         isRented:
 *           type: boolean
 *           description: Whether the equipment is currently rented
 *       example:
 *         nature: "combinaison"
 *         size: "M"
 *         reference: "COMB123"
 *         nextMaintenanceDate: "2023-12-01"
 *         isRented: false
 */


interface IEquipment extends Document {
    nature: "combinaison" | "detendeur" | "bouteille" | "masque" | "tuba" | "palme" | "ordinateur" | "lampe" | "video" | "ponny";
    size?: string; // Taille optionnelle (par exemple, pour combinaisons ou palmes)
    reference: string; // Référence unique pour chaque type
    nextMaintenanceDate: Date; // Date du prochain entretien
    isRented: boolean; // Si le matériel est actuellement loué
  }
  
  const EquipmentSchema: Schema = new Schema({
    nature: {
      type: String,
      enum: ["combinaison", "detendeur", "bouteille", "masque", "tuba", "palme", "ordinateur", "lampe", "video", "ponny"],
      required: true,
    },
    size: {
      type: String,
      default: null, // Optionnel pour les matériaux sans taille
    },
    reference: {
      type: String,
      required: true,
      unique: true, // Référence unique par nature
      trim: true,
    },
    nextMaintenanceDate: {
      type: Date,
      required: true,
    },
    isRented: {
      type: Boolean,
      required: true,
    },
  });
  
  const Equipment = mongoose.model<IEquipment>('Equipment', EquipmentSchema);
  
  export { Equipment, IEquipment };