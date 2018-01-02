import { GraphQLInt, GraphQLNonNull } from "graphql";
import { UserType } from "../types/UserType";
import joinMonster from "join-monster";
import { allowedFor, Roles } from "../../../lib/Guard";
import { AbstractField } from "../../_abstract/AbstractField";

export class UserQuery extends AbstractField {
  public constructor() {
    super();
  }

  public type = UserType;
  public args = {
    id: { type: new GraphQLNonNull(GraphQLInt) }
  };
  public where = (usersTable, args, ctx) => {
    // Escaping arguments in order to prevent SQL injecting is only needed if argument would be a string.
    // If argument is defined as integer, but argument in the Query is sent as a string or other type, then
    // Graphql validation will catch this error stop the Query execution immediately.
    // Example of escaping: return escape(`${usersTable}.id = %L`, args.user_id)
    return `${usersTable}.id = ${args.id}`;
  };

  @allowedFor([Roles.Everyone])
  public execute(obj, { id }, ctx, resolveInfo) {
    return joinMonster(resolveInfo, {}, sql => {
      return ctx.db.run(sql);
    });
  }
}
