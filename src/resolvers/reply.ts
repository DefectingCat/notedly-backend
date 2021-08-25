import { models } from 'mongoose';
import { author } from './comment';
import { favoritedBy } from './note';
import { Comment } from './comment';

export default {
  author,
  toUser: async (comment: Comment): Promise<void> => {
    return models.User.findById(comment.toUser);
  },
  favoritedBy,
};
