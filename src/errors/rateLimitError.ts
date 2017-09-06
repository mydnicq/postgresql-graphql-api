import { GraphQLError } from 'graphql'

export default class RateLimitError extends GraphQLError {
  code: number

  constructor (message) {
    super(message)
    this.code = 429
  }
}
