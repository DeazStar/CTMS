import jwt from 'jsonwebtoken';
import catchAsync from '../errors/catchAsync.js';
import AppError from '../errors/AppError.js';
import User from '../models/userModel.js';

const createSendToken = (data, res, next, user, message, statusCode) => {
  let cookieOption = {};
  jwt.sign(
    data,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES },
    (err, token) => {
      if (err) {
        return next(new AppError("Can't create token", 500));
      }

      if (process.env.NODE_ENV === 'dev') {
        cookieOption = {
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          httpOnly: false,
          secure: false,
        };
      } else if (process.env.NODE_ENV === 'prod') {
        console.log('cookie is secured');
        cookieOption = {
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: true,
        };
      }
      res.cookie('authCookie', token, cookieOption);
      res.status(statusCode).json({
        status: 'success',
        message: message,
        data: {
          user,
        },
      });
    },
  );
};

const extractId = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) reject(new AppError('Cookie is expired', 401));

      resolve(data.id);
    });
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return next(new AppError('User with this email already exists', 409));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const sanitizedData = user.toObject();

  delete sanitizedData.__v;
  delete sanitizedData.password;

  createSendToken(
    { id: user._id },
    res,
    next,
    sanitizedData,
    'successful signup',
    201,
  );
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const check = await user?.checkPassword(password);

  if (!user || !check)
    return next(new AppError('wrong email or password', 401));

  const sanitizedData = user.toObject();

  delete sanitizedData.__v;
  delete sanitizedData.password;

  createSendToken(
    { id: user._id },
    res,
    next,
    sanitizedData,
    'successful login',
    200,
  );
});

const protectRoute = catchAsync(async (req, res, next) => {
  const cookie = req.cookies;

  let id;
  try {
    id = await extractId(cookie.authCookie);

    const user = await User.findById(id);

    if (!user) next(new AppError("This user doesn't exist", 401));

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
});

export { signup, login, protectRoute };
