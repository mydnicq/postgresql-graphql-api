import { GraphQLInt, GraphQLNonNull } from "graphql";
import { UserType, UserInputType } from "../types";
import joinMonster from "join-monster";
import { allowedFor, Roles } from "../../../lib/Guard";
import { AbstractField } from "../../_abstract/AbstractField";
import { ValidationError } from "../../../errors";
import User from "../../../models/user";

export class CreateUserMutation extends AbstractField {
  public constructor() {
    super();
  }

  public type = UserType;
  public args = {
    input: { type: UserInputType }
  };

  @allowedFor([Roles.Everyone])
  public async execute(obj, { input }, ctx) {
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
}

// static async createUser(obj, { input }, ctx) {
//   let model = new User(input);
//   try {
//     await model.validate();
//     model.createTimestamps();
//     let { id, ...data }: any = model.serialize();
//     return await ctx.db.users.insert(data);
//   } catch (error) {
//     await model.handle(error);
//     throw new ValidationError(model.collectErrors());
//   }
// }
