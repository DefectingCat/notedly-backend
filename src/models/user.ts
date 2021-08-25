import mongoose from 'mongoose';

export interface User {
  _id: ID;
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface ID {
  $oid: string;
}

const UserSchema = new mongoose.Schema<User>({
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

const User = mongoose.model<User>('User', UserSchema);
export default User;
