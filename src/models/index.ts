/* eslint-disable @typescript-eslint/no-explicit-any */
import Note from './note';
import User from './user';
import Comment from './comment';
import Reply from './reply';
import { Model } from 'mongoose';

interface Models {
  Note: Model<any, any, any>;
  User: Model<any, any, any>;
  Comment: Model<any, any, any>;
  Reply: Model<any, any, any>;
  [key: string]: Model<any, any, any>;
}

const models: Models = {
  Note,
  User,
  Comment,
  Reply,
};

export default models;
