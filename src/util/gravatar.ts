/* Take in an email and generate a Gravatar url */
/* https://gravatar.com/site/implement/ */
import md5 from 'md5';

const gravatar = (email: string): string => {
  const hash = md5(email);
  return `https://cn.gravatar.com/avatar/${hash}.jpg?d=identicon`;
};

export default gravatar;
