import bcrypt from 'bcryptjs';
import { Joi } from 'celebrate';
import mongoose from 'mongoose';

import StatusCodeError from '../errors/status-code-error';
import { UNAUTHORIZED } from '../errors/status-codes';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

const avatarUrlRegex = /^https?:\/\/(?:www\.)?(?!www\.)(?:[a-z\d-]+\.)+[a-z]{2,}(?:[/?#][-\w.~:/?#[\]@!$&'()*+,;=]*)?$/i;

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    match: [avatarUrlRegex, 'Ссылка на аватар должна быть корректным HTTP или HTTPS URL'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => !Joi.string().email().validate(value).error,
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new StatusCodeError(UNAUTHORIZED, 'Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new StatusCodeError(UNAUTHORIZED, 'Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
