import { GraphQLError } from 'graphql'

export default class PermissionError extends GraphQLError {
  code: number

  constructor (message) {
    super(message)
    this.code = 403
  }
}
