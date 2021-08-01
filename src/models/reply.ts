import mongoose from 'mongoose';

// 定义笔记的数据库模式
const ReplySchema = new mongoose.Schema(
  {
    // 被回复的评论
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    // 创建评论的用户
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    // 被回复的用户
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // 添加 Date 类型的 createAt 和 updateAt 字段
    timestamps: true,
  }
);

// 通过模式定义 Note 模型
const Reply = mongoose.model('Reply', ReplySchema);

export default Reply;
