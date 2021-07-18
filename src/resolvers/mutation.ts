import models from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import gravatar from '../util/gravatar';

export default {
  /**
   * 这是创建新笔记对应的解析器
   * @param parent
   * @param args 笔记内容
   * @returns void
   */
  newNote: async (
    parent: unknown,
    args: { content: string }
  ): Promise<void> => {
    return await models.Note.create({
      content: args.content,
      author: 'xfy',
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
    args: { id: string; content: string }
  ): Promise<void> => {
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
    args: { id: string }
  ): Promise<boolean> => {
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
};
