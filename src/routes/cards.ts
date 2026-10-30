import { celebrate, Joi } from 'celebrate';
import {
  NextFunction, Request, Response, Router,
} from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/cards', (req: Request, res: Response, next: NextFunction) => getCards(req, res, next));

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), (req: Request, res: Response, next: NextFunction) => createCard(req, res, next));

router.delete('/cards/:cardId', (req: Request, res: Response, next: NextFunction) => deleteCard(req, res, next));

router.put('/cards/:cardId/likes', (req: Request, res: Response, next: NextFunction) => likeCard(req, res, next));

router.delete('/cards/:cardId/likes', (req: Request, res: Response, next: NextFunction) => dislikeCard(req, res, next));

export default router;
