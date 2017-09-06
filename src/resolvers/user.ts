import User from "../models/user";
import ValidationError from "../errors/validationError";
import joinMonster from "join-monster";
import { Roles, GuardQuery, GuardMutation } from "../lib/guard";
import { isArray } from "typeable";

export default class UserRepository {
  // @GuardQuery([Roles.Owner], "user_id")
  static user(obj, { user_id }, ctx, resolveInfo) {
    return joinMonster(resolveInfo, {}, sql => {
      return ctx.db.run(sql);
    });
  }

  static users(obj, args, ctx, resolveInfo) {
    return joinMonster(
      resolveInfo,
      {},
      sql => {
        return ctx.db.run(sql);
      },
      { dialect: "pg" }
    );
  }

  static async createUser(obj, { input }, ctx) {
    let model = new User(input);
    try {
      await model.validate();
      model.createTimestamps();
      let { id, ...data }: any = model.serialize();
      return await ctx.db.users.insert(data);
    } catch (error) {
      await model.handle(error);
      throw new ValidationError(model.collectErrors());
    }
  }

  @GuardMutation([Roles.Owner], "id")
  static async updateUser(obj, { id, input }, ctx) {
    let model = new User({ id, ...input });
    try {
      await model.validate();
      model.updateTimestamps();
      return await ctx.db.users.update(model.serialize());
    } catch (error) {
      await model.handle(error);
      throw new ValidationError(model.collectErrors());
    }
  }

  @GuardMutation([Roles.Admin])
  static async forceLogout(obj, { id }, ctx) {
    let { session_ids, ...user } = await ctx.db.users.findOne(id);
    if (isArray(session_ids)) {
      session_ids.forEach(element => ctx.redisClient.del(element));
      await ctx.db.users.update({
        id: user.id,
        session_ids: null
      });
    }
    return user;
  }
}
