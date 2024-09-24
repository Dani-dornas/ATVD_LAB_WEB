import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUsers } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.get('/users', listUsers);
router.put('/users', updateUsers);

export default router;