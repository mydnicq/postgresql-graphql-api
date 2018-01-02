import { GraphQLError } from "graphql";

export class RateLimitError extends GraphQLError {
  code: number;

  constructor(message) {
    super(message);
    this.code = 429;
  }
}
