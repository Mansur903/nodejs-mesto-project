import { celebrate, Joi } from 'celebrate';
import {
  NextFunction, Request, Response, Router,
} from 'express';
import {
  createUser, getUserById, getUsers, updateAvatar, updateProfile,
} from '../controllers/users';

const router = Router();

router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().required(),
  }),
}), (req: Request, res: Response, next: NextFunction) => createUser(req, res, next));

router.get('/users', (req: Request, res: Response, next: NextFunction) => getUsers(req, res, next));

router.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => getUserById(req, res, next));

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).min(1),
}), (req: Request, res: Response, next: NextFunction) => updateProfile(req, res, next));

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), (req: Request, res: Response, next: NextFunction) => updateAvatar(req, res, next));

export default router;
