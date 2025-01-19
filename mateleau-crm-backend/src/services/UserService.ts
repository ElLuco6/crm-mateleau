import { User } from '../models/User'; // Assurez-vous que le modèle User est correctement importé

// Service to get all users
export const getAllUsers = async () => {
    return await User.find();
};

// Service to create a new user
export const createUser = async (userData: any) => {
    const newUser = new User(userData);
    return await newUser.save();
};

// Service to update a user by id
export const updateUser = async (userId: string, userData: any) => {
    return await User.findByIdAndUpdate(userId, userData, { new: true });
};

// Service to delete a user by id
export const deleteUser = async (userId: string) => {
    return await User.findByIdAndDelete(userId);
};


// Service to get a user by id
export const getUserById = async (userId: string) => {
    return await User.findById(userId);
};

