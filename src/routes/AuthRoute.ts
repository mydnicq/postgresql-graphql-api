import Config from "../config";
import * as interfaces from "../interfaces";
import { Server, Database } from "../core";
import * as express from "express";
import * as passport from "passport";

export default class AuthRoute implements interfaces.Route {
  public setRoute(): void {
    Server.getInstance().post(
      "/auth",
      passport.authenticate("local", { session: false }),
      this._setSession()
    );
  }

  private _setSession() {
    return async function(
      req: interfaces.Request,
      res: express.Response,
      next: () => void
    ) {
      if (!req.session.viewer) {
        req.session.viewer = req.user;

        await Database.getInstance().users.update({
          id: req.user.id,
          session_ids: () => {
            let sessionId = `sess:${req.session.id}`;
            return req.user.session_ids
              ? req.user.session_ids.concat(sessionId)
              : [sessionId];
          }
        });

        let csrfSecret = await Server.getCsrfTokens().secret();
        let csrfToken = Server.getCsrfTokens().create(csrfSecret);
        req.session.csrfToken = csrfToken;
        res.cookie("xsrf-token", csrfToken, {
          maxAge: Config.sessionMaxAge,
          secure: Config.env === "development" ? false : true
        });
      }

      res.send("ok");
    };
  }
}
