import escape = require("pg-escape");
import resolvers from "../resolvers/user";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";

import { connectionArgs, connectionDefinitions } from "graphql-relay";

import { bookType } from "./book";

export const userType = new GraphQLObjectType({
  name: "User",
  sqlTable: "users",
  uniqueKey: "id",
  fields: {
    id: { type: GraphQLInt },
    name: {
      type: GraphQLString,
      sqlColumn: "name",
      complexity: 5
    },
    books: {
      type: new GraphQLList(bookType),
      sqlJoin: (userTable, bookTable, args) =>
        `${userTable}.id = ${bookTable}.user_id`,
      complexity: 5
    }
  }
});

const { connectionType: UserConnection } = connectionDefinitions({
  nodeType: userType,
  connectionFields: {
    total: { type: GraphQLInt }
  }
});

const userInput = new GraphQLInputObjectType({
  name: "UserInput",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLString
    }
  }
});

export const queryType = {
  name: "Query",
  fields: {
    user: {
      type: userType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      where: (usersTable, args, ctx) => {
        // return escape(`${usersTable}.id = %L`, args.user_id)
        return `${usersTable}.id = ${args.user_id}`;
      },
      resolve: resolvers.user
    },
    users: {
      type: UserConnection,
      args: connectionArgs,
      sqlPaginate: true,
      orderBy: "id",
      resolve: resolvers.users
    }
  }
};

export const mutationType = {
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        input: {
          type: userInput
        }
      },
      resolve: resolvers.createUser
    },
    updateUser: {
      description: "Update a user by id.",
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        input: {
          type: userInput
        }
      },
      resolve: resolvers.updateUser
    },
    forceLogout: {
      description: "Force logout a user.",
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: resolvers.forceLogout
    }
  }
};
