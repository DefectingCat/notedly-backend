import models from '../models';

export const favoritedBy = async (ctx: {
  favoritedBy: unknown[];
}): Promise<unknown> => {
  return await models.User.find({ _id: { $in: ctx.favoritedBy } });
};

export default {
  /**
   * 嵌套查询笔记作者信息
   * @param note
   * @returns
   */
  author: async (note: { author: string }): Promise<unknown> => {
    return await models.User.findById(note.author);
  },

  /**
   * 嵌套查询笔记收藏信息
   * @param note
   * @returns
   */
  favoritedBy,

  commentNum: async (note: { id: string }): Promise<unknown> => {
    return await models.Comment.count({
      post: note.id,
    });
  },
};
