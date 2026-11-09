import { celebrate, Joi } from 'celebrate';
import {
  NextFunction, Request, Response, Router,
} from 'express';
import {
  getCurrentUser,
  getUserById, getUsers, updateAvatar, updateProfile,
} from '../controllers/users';

const router = Router();

router.get('/users', (req: Request, res: Response, next: NextFunction) => getUsers(req, res, next));

router.get('/users/me', (req: Request, res: Response, next: NextFunction) => getCurrentUser(req, res, next));

router.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => getUserById(req, res, next));

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).min(1).required(),
}), (req: Request, res: Response, next: NextFunction) => updateProfile(req, res, next));

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }).required(),
}), (req: Request, res: Response, next: NextFunction) => updateAvatar(req, res, next));

export default router;
