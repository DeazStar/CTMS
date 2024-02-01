import { mongoose } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import AppError from '../errors/AppError.js';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid Email'],
  },
  password: {
    type: String,
    require: [true, 'Password is required'],
    minlength: [8, 'The password length should be more than 8 characters'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(new AppError("Can't hash the password", 500));
  }
});

const User = mongoose.model('User', userSchema);

export default User;
