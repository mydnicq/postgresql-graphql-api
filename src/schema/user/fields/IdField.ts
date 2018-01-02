import { GraphQLFieldConfig, GraphQLInt } from "graphql";

export class IdField implements GraphQLFieldConfig<any, any> {
  public type = GraphQLInt;
}
