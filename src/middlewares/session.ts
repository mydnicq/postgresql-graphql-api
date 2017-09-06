import * as session from "express-session";
import * as RedisStore from "connect-redis";
import App from "../app";

const SessionStore = RedisStore(session);

export function instantiateSession(app: App) {
  return session({
    name: `${app.ctx.config.appName}_sess`,
    cookie: {
      secure: app.ctx.config.env === "development" ? false : true,
      maxAge: app.ctx.config.sessionMaxAge
    },
    secret: app.ctx.config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      client: app.ctx.redisClient
    })
  });
}

export function initializeSession(app: App, csfrTokens: any) {
  return async function(req, res, next) {
    if (!req.session.viewer) {
      req.session.viewer = req.user;

      await app.ctx.db.users.update({
        id: req.user.id,
        session_ids: () => {
          let sessionId = `sess:${req.session.id}`;
          return req.user.session_ids
            ? req.user.session_ids.concat(sessionId)
            : [sessionId];
        }
      });

      let csrfSecret = await csfrTokens.secret();
      let csrfToken = csfrTokens.create(csrfSecret);
      req.session.csrfToken = csrfToken;
      res.cookie("xsrf-token", csrfToken, {
        maxAge: app.ctx.config.sessionMaxAge,
        secure: app.ctx.config.env === "development" ? false : true
      });
    }

    res.send("ok");
  };
}
