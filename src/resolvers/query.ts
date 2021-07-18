import models from '../models';

export default {
  notes: async (): Promise<void> => await models.Note.find(),
  note: async (parent: unknown, args: { id: string }): Promise<void> =>
    await models.Note.findById(args.id),
};
