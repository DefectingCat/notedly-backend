import models from '../models';

export default {
  notes: async (): Promise<void> => await models.Note.find(),
  note: async (parent: unknown, args: { id: string }): Promise<void> =>
    await models.Note.findById(args.id),
  user: async (
    parent: unknown,
    args: { username: string }
  ): Promise<unknown> => {
    return await models.User.findOne({ username: args.username });
  },
  users: async (): Promise<unknown> => {
    return await models.User.find({});
  },
  me: async (
    parent: unknown,
    args: unknown,
    ctx: { user: { id: string } }
  ): Promise<unknown> => {
    return await models.User.findById(ctx.user.id);
  },
};
