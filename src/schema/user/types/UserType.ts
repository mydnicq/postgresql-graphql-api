import { GraphQLObjectType } from "graphql";
import { IdField, NameField } from "../fields";

export const UserType = new GraphQLObjectType({
  name: "User",
  description: "A single user.",
  fields: () => ({
    id: new IdField(),
    name: new NameField()
  }),
  sqlTable: "users",
  uniqueKey: "id"
});
