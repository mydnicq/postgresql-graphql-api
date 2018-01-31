// import { TYPES, lazyInject, injectable } from "../../../ioc";
// import * as I from "../../../interfaces";
import {
  GraphQLID,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLFieldResolver
} from "graphql";
import joinMonster from "join-monster";

export abstract class AbstractField implements GraphQLFieldConfig<any, any> {
  abstract type: any;
  public resolve: GraphQLFieldResolver<any, any>;

  public constructor() {
    this.resolve = this.execute;
  }

  public execute(obj, args, ctx, resolveInfo) {
    return joinMonster(resolveInfo, {}, sql => {
      return ctx.db.run(sql);
    });
  }
}
