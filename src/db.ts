import mongoose from 'mongoose';

export default {
  /**
   * 这个方法用于设置和连接数据库
   * @param DB_HOST 数据库地址
   */
  connect: (DB_HOST: string): void => {
    // 使用 Mongo 驱动新的 URL 字符串解析器
    mongoose.set('useNewUrlParser', true);
    // 使用 findOneAndUpdate() 代替 useFindAndModify()
    mongoose.set('useFindAndModify', false);
    // 使用 createIndex() 代替 ensureIndex()
    mongoose.set('useCreateIndex', true);
    // 使用新的服务器发现和监控引擎
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(DB_HOST);
    mongoose.connection.on('error', (err) => {
      console.log(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },
  close: (): void => {
    mongoose.connection.close();
  },
};
