import jwt from 'jsonwebtoken';

/**
 * 根据 HTTP 传递过来的 token 验证用户
 */
export default (token: string): string | jwt.JwtPayload | undefined => {
  try {
    return jwt.verify(token, '123');
  } catch (e) {
    throw new Error('Session invalid');
  }
};
