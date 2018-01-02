import { GraphQLFieldConfig, GraphQLString } from "graphql";

export class NameField implements GraphQLFieldConfig<any, any> {
  public type = GraphQLString;
}
