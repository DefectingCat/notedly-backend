import mongoose from 'mongoose';

// 定义笔记的数据库模式
const CommentSchema = new mongoose.Schema(
  {
    // 被评论的文章的 id
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
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
const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
