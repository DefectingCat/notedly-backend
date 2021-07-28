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

/**
 * 这是查询所有笔记分页的方法
 * 对应前端的首页
 * @param cursor 分页时的笔记 id
 * @returns
 */
const queryNotes = async (cursor?: string) => {
  // 限制每次返回 10 个元素
  const limit = 10;
  let hasNextPage = false;

  /**
   * 如果没有传递游标
   * 则从数据库中获取最新的笔记
   */
  let cursorQuery = {};

  /**
   * 如果传递了游标
   * 则查询对象 ID 小于游标的笔记
   */
  if (cursor) cursorQuery = { _id: { $lt: cursor } };

  // 从数据库中查询 limit + 1 篇笔记，从新到旧排序
  let notes = await models.Note.find(cursorQuery)
    .sort({ _id: -1 })
    .limit(limit + 1);

  /**
   *  返回新游标，查询下一页
   *  新游标是笔记动态数组中最后一个元素的 ID
   */
  let newCursor = '';

  /**
   * 如果查询笔记数量大于限制数量
   * 把 hasNextPage 设为 true，截取结果，返回限定的数量
   */
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
};

/**
 * 该方法是查询当前用户的所有笔记的分页方法
 * 对应在 我的动态
 * @param cursor 分页时的笔记 id
 * @param _id 上下文中的用户 id
 * @returns
 */
const queryMyNotes = async (cursor?: string, _id?: string) => {
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
};

export default {
  notes: async (): Promise<void> => await models.Note.find(),
  note: async (parent: unknown, args: { id: string }): Promise<void> =>
    await models.Note.findById(args.id),
  user: async (
    parent: unknown,
    args: { username: string }
  ): Promise<unknown> => {
    return await models.User.findOne({ username: args.username });
  },
  users: async (): Promise<unknown> => {
    return await models.User.find({});
  },
  me: async (
    parent: unknown,
    args: unknown,
    ctx: { user: { id: string } }
  ): Promise<unknown> => {
    return await models.User.findById(ctx.user.id);
  },

  /**
   * 笔记分页方法
   * @param parent
   * @param args
   * @returns
   */
  noteFeed: async (
    parent: unknown,
    args: { cursor?: string }
  ): Promise<unknown> => {
    return await queryNotes(args.cursor);
  },

  myNotes: async (
    parent: unknown,
    args: { cursor?: string },
    ctx: { user: { id: string } }
  ): Promise<unknown> => {
    return await queryMyNotes(args.cursor, ctx.user.id);
  },
};
