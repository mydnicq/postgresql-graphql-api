import { GraphQLInt } from "graphql";
import { UserType } from "../types/UserType";
import joinMonster from "join-monster";
import { AbstractField } from "../../_abstract/AbstractField";
import { connectionArgs, connectionDefinitions } from "graphql-relay";

const { connectionType: UserConnection } = connectionDefinitions({
  nodeType: UserType,
  connectionFields: {
    total: { type: GraphQLInt }
  }
});

export class UsersQuery extends AbstractField {
  public constructor() {
    super();
  }

  public type = UserConnection;
  public args = connectionArgs;
  public sqlPaginate = true;
  public orderBy = "id";

  public execute(obj, { id }, ctx, resolveInfo) {
    return joinMonster(
      resolveInfo,
      {},
      sql => {
        return ctx.db.run(sql);
      },
      { dialect: "pg" }
    );
  }
}
