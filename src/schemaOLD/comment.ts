import Comment from "../models/comment";
import ValidationError from "../errors/validationError";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType
} from "graphql";
import joinMonster from "join-monster";

export const commentType = new GraphQLObjectType({
  name: "Comment",
  sqlTable: "comments",
  uniqueKey: "id",
  fields: () => ({
    id: { type: GraphQLInt },
    comment: {
      type: GraphQLString,
      sqlColumn: "comment"
    },
    author: {
      // This is needed because of circular dependency
      type: require("./user").userType,
      sqlJoin: (commentTable, userTable) =>
        `${commentTable}.user_id = ${userTable}.id`
    }
  })
});

const commentInput = new GraphQLInputObjectType({
  name: "CommentInput",
  fields: {
    comment: {
      type: new GraphQLNonNull(GraphQLString)
    },
    user_id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    book_id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
});

export const mutationType = {
  name: "Mutation",
  fields: {
    createComment: {
      type: commentType,
      args: {
        input: {
          type: commentInput
        }
      },
      resolve: async (obj, { input }, ctx): Promise<any> => {
        let model = new Comment(input);
        try {
          await model.validate();
          model.createTimestamps();
          let { id, ...data }: any = model.serialize();
          return await ctx.db.comments.insert(data);
        } catch (error) {
          await model.handle(error);
          throw new ValidationError(model.collectErrors());
        }
      }
    }
  }
};
