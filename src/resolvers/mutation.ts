import models from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import gravatar from '../util/gravatar';
import mongoose from 'mongoose';
import { ForbiddenError } from 'apollo-server-koa';

/**
 * 该方法是 favoriteComment 操作数据的动作抽象
 * @param col 被操作的集合
 * @param inc favoriteCount 增加还是减少
 * @param id 查询的评论 id
 * @param userId 上下文中的用户 id
 * @returns
 */
const togFavorite = async (
  col: 'Reply' | 'Comment',
  inc: boolean,
  id: string,
  userId: string
) => {
  if (inc) {
    return await models[col].findByIdAndUpdate(
      id,
      {
        $push: {
          favoritedBy: mongoose.Types.ObjectId(userId),
        },
        $inc: {
          favoriteCount: 1,
        },
      },
      {
        new: true,
      }
    );
  } else {
    return await models[col].findByIdAndUpdate(
      id,
      {
        $pull: {
          favoritedBy: mongoose.Types.ObjectId(userId),
        },
        $inc: {
          favoriteCount: -1,
        },
      },
      {
        new: true,
      }
    );
  }
};

export default {
  /**
   * 这是创建新笔记对应的解析器
   * @param parent
   * @param args 笔记内容
   * @returns void
   */
  newNote: async (
    parent: unknown,
    args: { content: string },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to create a note');

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(ctx.user.id),
    });
  },

  /**
   * 这是更新笔记对应的解析器
   * @param parent
   * @param args 笔记 id 与内容
   * @returns void
   */
  updateNote: async (
    parent: unknown,
    args: { id: string; content: string },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to update a note');

    // 验证当前用户所修改的笔记
    const note = await models.Note.findById(args.id);
    if (note && String(note.author) !== ctx.user.id)
      throw new ForbiddenError(`You don't have permissions to update the note`);

    return await models.Note.findOneAndUpdate(
      {
        _id: args.id,
      },
      {
        $set: {
          content: args.content,
        },
      },
      {
        new: true,
      }
    );
  },

  /**
   * 这是删除笔记对应的解析器
   * @param parent
   * @param args 笔记 id
   * @returns 是否删除成功
   */
  deleteNote: async (
    parent: unknown,
    args: { id: string },
    ctx: { user: { id: string } }
  ): Promise<boolean> => {
    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to delete a note');

    // 验证当前用户所修改的笔记
    const note = await models.Note.findById(args.id);
    if (note && String(note.author) !== ctx.user.id)
      throw new ForbiddenError(`You don't have permissions to delete the note`);

    try {
      await models.Note.findOneAndDelete({
        _id: args.id,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  /**
   * 这是用户注册所对应的解析器
   * @param parent 嵌套调用
   * @param args 用户信息
   * @returns JWT 令牌
   */
  signUp: async (
    parent: unknown,
    args: { username: string; email: string; password: string }
  ): Promise<string> => {
    // 规范电子邮件地址
    const email = args.email.trim().toLowerCase();
    // 计算密码的 hash 值
    const hashed = await bcrypt.hash(args.password, 10);
    //  gravatar
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username: args.username,
        password: hashed,
        email,
        avatar,
      });

      // 创建并返回 JWT
      return jwt.sign({ id: user._id }, '123');
    } catch (e) {
      console.log(e);
      throw new Error('Error creating account');
    }
  },

  /**
   * 这是用户登录对应的解析器
   * @param parent
   * @param args 用户信息
   * @returns JWT 令牌
   */
  signIn: async (
    parent: unknown,
    args: { username: string; email?: string; password: string }
  ): Promise<string> => {
    // 规范电子邮件地址
    let email = '';
    if (args.email) email = args.email.trim().toLowerCase();

    const { username, password } = args;

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    // 如果未找到用户，则抛出 AuthenticationError
    if (!user) throw new AuthenticationError('Error signing in');

    const valid = await bcrypt.compare(password, user.password);
    // 如果密码错误，则抛出 AuthenticationError
    if (!valid) throw new AuthenticationError('Error signing in');
    // 创建并返回 JWT
    return jwt.sign({ id: user._id }, '123');
  },

  /**
   * 收藏笔记对应数据库方法
   * @param parent
   * @param args 笔记 id
   * @param ctx 用户 id
   * @returns
   */
  toggleFavorite: async (
    parent: unknown,
    args: { id: string },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    const { id } = args;
    const { user } = ctx;

    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to do it');

    // 判断当前用户是否已经点赞
    const noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    if (~hasUser) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },

  /**
   * 该函数用于添加新的评论
   * @param parent
   * @param args content：评论内容；post 当前文章 id；reply：回复的父评论 id；to：被回复的用户 id
   * @param ctx
   * @returns
   */
  newComment: async (
    parent: unknown,
    args: { content: string; post: string; reply?: string; to?: string },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    if (!ctx.user)
      throw new AuthenticationError(
        'You must be signed in to create a comment'
      );

    const { content, post, reply, to } = args;

    if (reply) {
      return await models.Reply.create({
        parent: mongoose.Types.ObjectId(reply),
        content,
        author: mongoose.Types.ObjectId(ctx.user.id),
        toUser: mongoose.Types.ObjectId(to),
      });
    } else {
      return await models.Comment.create({
        post: mongoose.Types.ObjectId(post),
        content,
        author: mongoose.Types.ObjectId(ctx.user.id),
      });
    }
  },

  /**
   *
   * @param parent
   * @param args id：被点赞的评论 id
   * @param ctx
   */
  favoriteComment: async (
    parent: unknown,
    args: { id: string; isReply?: boolean },
    ctx: { user: { id: string } }
  ): Promise<void> => {
    const { id, isReply } = args;
    const { user } = ctx;

    if (!ctx.user)
      throw new AuthenticationError('You must be signed in to do it');

    if (isReply) {
      const check = await models.Reply.findById(id);
      const hasUser = check.favoritedBy.indexOf(user.id);

      if (~hasUser) {
        return await togFavorite('Reply', false, id, user.id);
      } else {
        return await togFavorite('Reply', true, id, user.id);
      }
    } else {
      const check = await models.Comment.findById(id);
      const hasUser = check.favoritedBy.indexOf(user.id);

      if (~hasUser) {
        return await togFavorite('Comment', false, id, user.id);
      } else {
        return await togFavorite('Comment', true, id, user.id);
      }
    }
  },
};
