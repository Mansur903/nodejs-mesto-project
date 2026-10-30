import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';
import Card from '../models/card';
import type { RequestWithUser } from '../types';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = (req as RequestWithUser).user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findOneAndDelete({ _id: req.params.cardId })
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send({ data: card });
  })
  .catch(next);

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as RequestWithUser).user._id;

  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as RequestWithUser).user._id;

  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch(next);
};
