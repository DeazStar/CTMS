import mongoose from 'mongoose';

const invetationSchema = mongoose.Schema({
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Invited user is required'],
  },
  invitee: {
    type: String,
    require: [true, 'Invitee email is required'],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Project is required'],
  },
  invetationStatus: {
    type: String,
    enum: ['sent', 'accepted', 'rejected'],
    require: [true, 'Invetation status is required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: [true, 'created date is required'],
  },
  updatedAt: {
    type: Date,
  },
});

const Invetation = mongoose.model('Invetation', invetationSchema);

export default Invetation;
