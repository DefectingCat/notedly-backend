import models from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import gravatar from '../util/gravatar';
import mongoose from 'mongoose';
import { ForbiddenError } from 'apollo-server-koa';

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
   * 评论
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
      await models.Reply.findByIdAndUpdate(reply, {
        hasReply: true,
      });
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
};
