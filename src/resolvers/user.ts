import models from '../models';

export default {
  /**
   * 嵌套查询用户收藏的所有笔记
   * @param user
   * @returns
   */
  favorites: async (user: { _id: string }): Promise<unknown> => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};

/**
 * Shell 查询示例：
 * ObjectId("60fffd97e9547643f0e34053")
 * db.notes.find({_id: {$lt: ObjectId("60fffd97e9547643f0e34053")}})
 * db.notes.find({author: ObjectId("60fffd4ae9547643f0e34044")})
 *
 db.notes.find({
  $and: [
    {author: ObjectId("60fffd4ae9547643f0e34044")},
    {_id: {$lt: ObjectId("60fffd97e9547643f0e34053")}}
  ]
 })

  db.notes.find({
  $and: [
    {author: ObjectId("60fffd4ae9547643f0e34044")},
    {_id: {}}
  ]
 })
 */
