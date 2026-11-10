import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { JWT_SECRET } from '../config';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import { CREATED } from '../errors/status-codes';
import normalizeDatabaseError from '../helpers/normalize-database-error';
import User from '../models/user';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err: unknown) => {
      if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }

      return next(normalizeDatabaseError(err));
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch((err: unknown) => next(normalizeDatabaseError(err)));

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send({ data: user });
  })
  .catch((err: unknown) => next(normalizeDatabaseError(err)));

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return res
        .cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 })
        .send({ message: 'Вход выполнен' });
    })
    .catch((err: unknown) => next(normalizeDatabaseError(err)));
};
