// import ValidationError from "../errors/validationError";
// import joinMonster from "join-monster";
import { Roles, GuardQuery, GuardMutation, GuardField } from "../lib/guard";

export default class BookResolvers {
  @GuardField([Roles.Owner], "author_id")
  static getName(obj, args, ctx) {
    return obj.name;
  }
}
