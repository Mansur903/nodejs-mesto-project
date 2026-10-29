import {
  NextFunction, Request, Response, Router,
} from 'express';
import {
  createUser, getUserById, getUsers, updateAvatar, updateProfile,
} from '../controllers/users';

const router = Router();

router.post('/users', (req: Request, res: Response, next: NextFunction) => createUser(req, res, next));

router.get('/users', (req: Request, res: Response, next: NextFunction) => getUsers(req, res, next));

router.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => getUserById(req, res, next));

router.patch('/users/me', (req: Request, res: Response, next: NextFunction) => updateProfile(req, res, next));

router.patch('/users/me/avatar', (req: Request, res: Response, next: NextFunction) => updateAvatar(req, res, next));

export default router;
