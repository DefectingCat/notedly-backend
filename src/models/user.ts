import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    index: { unique: true },
  },
  email: {
    type: String,
    require: true,
    index: { unique: true },
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
