import { GraphQLError } from "graphql";

export class PermissionError extends GraphQLError {
  code: number;

  constructor(message) {
    super(message);
    this.code = 403;
  }
}
