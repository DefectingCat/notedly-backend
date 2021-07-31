import { author } from './comment';
import models from '../models';

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
  /*   reply: async function (reply: Reply): Promise<Reply[] | undefined> {
    if (reply.hasReply) {
      const replies: Reply[] = [];

      const data: Reply = await models.Reply.find({
        parent: reply._id,
      });

      replies.push(data);
      if (data.hasReply) {
        this.reply(data);
      }

      console.log(replies);

      return replies;
    }
  }, */
};
