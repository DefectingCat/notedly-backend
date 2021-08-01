import { author } from './comment';
import { favoritedBy } from './note';

interface Reply {
  _id: string;
  content: string;
  parent: string;
  author: string;
  hasReply: boolean;
}

export default {
  author,
  toUser: author,
  favoritedBy,
};
