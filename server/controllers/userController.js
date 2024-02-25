import bcrypt from 'bcrypt';
import catchAsync from '../errors/catchAsync.js';
import AppError from '../errors/AppError.js';
import User from '../models/userModel.js';

const updateProfile = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { email, firstName, lastName, password } = req.body;

  if (password)
    return next(
      new AppError(
        'user route /profile/update-password to change password',
        400,
      ),
    );

  const updatedProfile = await User.findByIdAndUpdate(user._id, {
    firstName,
    lastName,
    email,
    updatedAt: new Date(),
  }).select('-password -__v');

  res.status(200).json({ status: 200, data: updatedProfile });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  const userModel = User.findById(user._id);

  if (!userModel) return next(new AppError('Unautorized error', 401));

  const check = user.checkPassword(oldPassword);

  if (!check) return next(new AppError('Incorrect password', 401));

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  res.status(200).json({
    status: 'success',
    message: 'password successfully updated',
  });
});

const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('File must exist', 400));

  const path = `/server/public/user/${req.filename}`;
  await User.findByIdAndUpdate(req.user._id, {
    profile: path,
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile image uploaded successfully',
  });
});

export { updatePassword, updateProfile, updateAvatar };
