import {
	GraphQLObjectType,
	GraphQLString
} from 'graphql'

export const queryType = {
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: function (_, {id}) {
        return 'HI33'
      }
    }
  }
}

export const mutationType = {
  name: 'Mutation',
  fields: {
    changeHello: {
      type: GraphQLString,
      resolve: function (_, {id}) {
        return 'HI33'
      }
    }
  }
}
