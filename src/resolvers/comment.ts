import models from '../models';
import { favoritedBy } from './note';

// Generated by https://quicktype.io

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: string;
  toUser: string;
}

/**
 * 该函数用于嵌套查询评论与回复中的用户信息
 * 同时也用在 reply.ts 的嵌套查询中
 * @param comment 当前父查询的结果
 * @returns
 */
export async function author(comment: Comment): Promise<void> {
  return models.User.findById(comment.author);
}

export default {
  /**
   * 该函数用于在评论集合中查询回复
   * 用于 GraphQL 的嵌套查询
   * @param comments 当前父查询的结果
   * @returns
   */
  reply: async (comment: Comment): Promise<void> => {
    return await models.Reply.find({
      parent: comment._id,
    });
  },
  author,
  favoritedBy,
};
