import { NextFunction, Request, Response } from 'express';
import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/not-found-error';
import { CREATED } from '../errors/status-codes';
import normalizeDatabaseError from '../helpers/normalize-database-error';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err: unknown) => next(normalizeDatabaseError(err)));

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Вы не можете удалить чужую карточку');
    }
    return card.deleteOne().then(() => res.send({ data: card }));
  })
  .catch((err: unknown) => next(normalizeDatabaseError(err)));

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};
