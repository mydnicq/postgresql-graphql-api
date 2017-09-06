import Book from "../models/book";
import ValidationError from "../errors/validationError";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLList
} from "graphql";
import joinMonster from "join-monster";
import { commentType } from "./comment";
import resolvers from "../resolvers/book";

export const bookType = new GraphQLObjectType({
  name: "Book",
  sqlTable: "books",
  uniqueKey: "id",
  fields: {
    id: { type: GraphQLInt },
    name: {
      type: GraphQLString,
      sqlColumn: "name",
      resolve: resolvers.getName
    },
    author_id: {
      type: GraphQLInt,
      sqlColumn: "user_id"
    },
    comments: {
      type: new GraphQLList(commentType),
      // Instead of using JOIN statement below, we can use postgres json_agg function
      // sqlJoin: (bookTable, commentTable, args) => `${commentTable}.book_id = ${bookTable}.id`,
      jmIgnoreTable: true,
      sqlExpr: bookTable =>
        `(SELECT json_agg(comments) FROM comments WHERE comments.book_id = ${bookTable}.id)`
    },
    numBooks: {
      type: GraphQLInt,
      sqlExpr: booksTable => `(SELECT COUNT(*) FROM books)`
    }
  }
});

const bookInput = new GraphQLInputObjectType({
  name: "BookInput",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    user_id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
});

export const mutationType = {
  name: "Mutation",
  fields: {
    createBook: {
      type: bookType,
      args: {
        input: {
          type: bookInput
        }
      },
      resolve: async (obj, { input }, ctx): Promise<any> => {
        let model = new Book(input);
        try {
          await model.validate();
          model.createTimestamps();
          let { id, ...data }: any = model.serialize();
          return await ctx.db.books.insert(data);
        } catch (error) {
          await model.handle(error);
          throw new ValidationError(model.collectErrors());
        }
      }
    },
    updateBook: {
      description: "Update a book by id.",
      type: bookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        input: {
          type: bookInput
        }
      },
      resolve: async (obj, { id, input }, ctx): Promise<any> => {
        let model = new Book({ id, ...input });
        try {
          await model.validate();
          model.updateTimestamps();
          return await ctx.db.books.update(model.serialize());
        } catch (error) {
          await model.handle(error);
          throw new ValidationError(model.collectErrors());
        }
      }
    }
  }
};
