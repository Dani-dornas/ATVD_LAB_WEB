import { Request, Response } from 'express';
import User from '../models/userModel';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting user' });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const users = await User.find({});
        if(!users) {
            return res.status(204).send()
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({error: "Error finding users"})
    }
}

export const updateUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        // Verifica se o ID do usuário foi passado
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Atualiza o usuário com base no ID fornecido
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        // Se o usuário não for encontrado
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Retorna o usuário atualizado
        res.status(200).json(updatedUser);
    } catch (error) {
        // Captura qualquer erro
        res.status(400).json({ error: "Error updating user" });
    }
};

