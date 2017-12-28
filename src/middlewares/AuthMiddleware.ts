import Config from "../config";
import * as interfaces from "../interfaces";
import { Server, Database } from "../core";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";

export default class AuthMiddleware implements interfaces.Middleware {
  public setMiddleware() {
    Server.getInstance().use(passport.initialize());
    this._addLocalStrategy();
  }

  private _addLocalStrategy() {
    return passport.use(
      new LocalStrategy(async function(username, password, done) {
        try {
          let user = await Database.getInstance().users.findOne(1);
          // If user is not found, Passport will respond with a 401 Unauthorized status.
          return user ? done(null, user) : done(null, false);
        } catch (error) {
          return done(error);
        }
      })
    );
  }
}
