import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  isRead: {
    type: Boolean,
    defaut: false,
    required: [true, 'isRead is required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: [true, 'createdAt is required'],
  },
  updatedAt: {
    type: Date,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
