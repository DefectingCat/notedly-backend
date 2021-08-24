import { Schema, model } from 'mongoose';
import { User } from './user';

interface Note {
  content: string;
  author: User[];
  favoriteCount?: number;
  favoritedBy?: User[];
}

// 定义笔记的数据库模式
const NoteSchema = new Schema<Note>(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: Schema.Types.ObjectId,
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
const Note = model<Note>('Note', NoteSchema);

export default Note;
