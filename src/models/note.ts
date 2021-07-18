import mongoose from 'mongoose';

// 定义笔记的数据库模式
const NoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
  },
  {
    // 添加 Date 类型的 createAt 和 updateAt 字段
    timestamps: true,
  }
);

// 通过模式定义 Note 模型
const Note = mongoose.model('Note', NoteSchema);

export default Note;
