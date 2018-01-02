import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { IdField, NameField } from "../fields";

export const UserInputType = new GraphQLInputObjectType({
  name: "UserInput",
  description: "Fields required for creating a user.",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString }
  })
});
