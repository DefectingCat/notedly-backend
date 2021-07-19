import models from '../models';

export default {
  /**
   * 嵌套查询用户发布的所有笔记
   * @param user
   * @returns
   */
  notes: async (user: { _id: string }): Promise<unknown> => {
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },

  /**
   * 嵌套查询用户收藏的所有笔记
   * @param user
   * @returns
   */
  favorites: async (user: { _id: string }): Promise<unknown> => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};
