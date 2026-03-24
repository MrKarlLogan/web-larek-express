import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import { REFRESH_TOKEN } from '../config';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import User from '../model/user';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +tokens');

    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Неправильные email или пароль',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({
        success: false,
        message: 'Неправильные email или пароль',
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

    return res.json({
      success: true,
      user: user.toJSON(),
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const newUser = new User({ email, password, name });
    await newUser.save();
    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      user: newUser.toJSON(),
      accessToken,
    });
  } catch (e) {
    if (e instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(e.message));
    }
    if (e instanceof Error && e.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(e);
  }
};

const getUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по заданному id отсутствует в базе'),
    );
    res.send({ user: user.toJSON(), success: true });
  } catch (e) {
    next(e);
  }
};

const deleteRefreshToken = async (req: Request) => {
  const { cookies } = req;
  const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

  if (!refreshToken) throw new UnauthorizedError('Не валидный токен');

  const decoderRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN.secret) as JwtPayload;

  const user = await User.findOne({
    _id: decoderRefreshToken._id,
  }).orFail(() => new UnauthorizedError('Пользователь не найден в базе'));

  const refreshTokenHash = crypto
    .createHmac('sha256', REFRESH_TOKEN.secret)
    .update(refreshToken)
    .digest('hex');

  const filterTokens = user.tokens.filter(tokenObj => tokenObj.token !== refreshTokenHash);

  user.tokens = filterTokens;

  await user.save();

  return user;
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRefreshToken(req);
    const expireCookieOptions = {
      ...REFRESH_TOKEN.cookie.options,
      maxAge: -1,
    };
    res.cookie(REFRESH_TOKEN.cookie.name, '', expireCookieOptions);
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.clearCookie(REFRESH_TOKEN.cookie.name);
    next(e);
  }
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deleteRefreshToken(req);
    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);

    return res.send({
      success: true,
      user: user.toJSON(),
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};

export { login, register, getUser, logout, refreshAccessToken };
