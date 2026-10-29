import { Request, Response, Router } from 'express';
import { createUser, getUserById, getUsers } from '../controllers/users';

const router = Router();

router.post('/users', (req: Request, res: Response) => createUser(req, res));

router.get('/users', (req: Request, res: Response) => getUsers(req, res));

router.get('/users/:userId', (req: Request, res: Response) => getUserById(req, res));

export default router;
