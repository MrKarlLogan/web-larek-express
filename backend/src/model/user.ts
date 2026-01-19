import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
  toJSON(): Omit<IUser, 'password' | 'tokens'>;
}

const userSchema = new mongoose.Schema<
  IUser,
  Model<IUser, Record<string, never>, IUserMethods>,
  IUserMethods
>({
  name: {
    type: String,
    default: 'Новый пользователь',
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная длина поля name - 30'],
  },
  email: {
    type: String,
    required: [true, 'Поле email не должно быть пустым'],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Должен быть валидный email адрес',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password не должно быть пустым'],
    minlength: [6, 'Минимальная длина поля password - 6'],
    select: false,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.generateAccessToken = function createAccessToken() {
  return jwt.sign(
    {
      _id: this._id,
    },
    ACCESS_TOKEN.secret,
    { expiresIn: ACCESS_TOKEN.expiry as jwt.SignOptions['expiresIn'] },
  );
};

userSchema.methods.generateRefreshToken = async function createRefreshToken() {
  const refreshToken = jwt.sign({ _id: this._id }, REFRESH_TOKEN.secret, {
    expiresIn: REFRESH_TOKEN.expiry as jwt.SignOptions['expiresIn'],
  });

  const refreshTokenHash = crypto
    .createHmac('sha256', REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest('hex');

  this.tokens.push({ token: refreshTokenHash });
  await this.save();

  return refreshToken;
};

userSchema.methods.toJSON = function json(): Omit<IUser, 'password' | 'tokens'> {
  const { password: _password, tokens: _tokens, ...data } = this.toObject();
  return data;
};

export default mongoose.model<IUser, Model<IUser, Record<string, never>, IUserMethods>>(
  'user',
  userSchema,
);
