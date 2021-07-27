import models from '../models';

interface NoteQuery {
  $and:
    | (
        | {
            author: string;
          }
        | Record<string, unknown>
      )[]
    | (
        | {
            author: string;
            _id?: undefined;
          }
        | {
            _id: {
              $lt: string;
            };
            author?: undefined;
          }
      )[];
}

export default {
  /**
   * 嵌套查询用户发布的所有笔记
   * @param args
   * @returns
   */
  myNotes: async (
    user: { _id: string },
    args: { cursor?: string }
  ): Promise<unknown> => {
    const { _id } = user;
    const { cursor } = args;
    const limit = 10;

    let hasNextPage = false;

    // 没有传递 cursor 的情况下查询所有的笔记
    const cursorQuery: NoteQuery = {
      $and: [{ author: _id }, {}],
    };

    // 当传递了 cursor 将查询的另一个添加设置为小于 id
    if (cursor) cursorQuery['$and'][1] = { _id: { $lt: cursor } };

    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    let newCursor = '';

    // 把 hasNextPage 设为 true，截取结果，返回限定的数量
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
      newCursor = notes[notes.length - 1]._id; // 只在有下一页时传递新的 cursor
    }

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    };
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
