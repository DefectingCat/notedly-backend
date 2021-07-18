import models from '../models';

export default {
  newNote: async (
    parent: unknown,
    args: { content: string }
  ): Promise<void> => {
    return await models.Note.create({
      content: args.content,
      author: 'xfy',
    });
  },
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
};
