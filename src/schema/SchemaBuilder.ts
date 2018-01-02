import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { UserQuery, UsersQuery } from "./user/queries";
import { CreateUserMutation } from "./user/mutations";

export class SchemaBuilder {
  private static instance: SchemaBuilder;

  private rootQuery: GraphQLObjectType = new GraphQLObjectType({
    name: "Query",
    fields: {
      user: new UserQuery(),
      users: new UsersQuery()
    }
  });

  private rootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createUser: new CreateUserMutation()
    }
  });

  private schema: GraphQLSchema = new GraphQLSchema({
    query: this.rootQuery,
    mutation: this.rootMutation
  });

  public static async make(): Promise<GraphQLSchema> {
    return this.getSchema();
  }

  public static getSchema(): GraphQLSchema {
    if (!SchemaBuilder.instance) {
      SchemaBuilder.instance = new SchemaBuilder();
    }
    return SchemaBuilder.instance.schema;
  }
}
