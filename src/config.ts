export default {
  DB_HOST:
    process.env.NODE_ENV === 'production'
      ? 'mongodb://mongo/notedly'
      : 'mongodb://127.0.0.1/notedly',
  PORT: 3000,
};
