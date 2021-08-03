import { models } from 'mongoose';
import { author } from './comment';
import { favoritedBy } from './note';
import { Comment } from './comment';

interface Reply {
  _id: string;
  content: string;
  parent: string;
  author: string;
  hasReply: boolean;
}

export default {
  author,
  toUser: async (comment: Comment): Promise<void> => {
    return models.User.findById(comment.toUser);
  },
  favoritedBy,
};
