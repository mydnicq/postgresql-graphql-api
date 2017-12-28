import Config from "../config";
import * as interfaces from "../interfaces";
import { Server, RedisClient } from "../core";
import * as session from "express-session";
import * as RedisStore from "connect-redis";

const SessionStore = RedisStore(session);

export default class SessionMiddleware implements interfaces.Middleware {
  public setMiddleware() {
    Server.getInstance().use(this._handler());
  }

  private _handler() {
    return session({
      name: `${Config.appName}_sess`,
      cookie: {
        secure: Config.env === "development" ? false : true,
        maxAge: Config.sessionMaxAge
      },
      secret: Config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        client: RedisClient.getInstance()
      })
    });
  }
}
