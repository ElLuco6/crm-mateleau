import { User } from '../models/User'; // Assurez-vous que le modèle User est correctement importé

// Service to get all users
export const getAllUsers = async () => {
    return await User.find();
};


