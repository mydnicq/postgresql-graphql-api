import App from "../app";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";

export function addLocalStrategy(app: App) {
  return passport.use(
    new LocalStrategy(async function(username, password, done) {
      console.log(username);

      try {
        let user = await app.ctx.db.users.findOne(1);
        // If user is not found, Passport will respond with a 401 Unauthorized status.
        return user ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error);
      }
    })
  );
}

/*
When performing XHR requests, the $http service reads a token from a cookie (by default, XSRF-TOKEN) and sets it as an HTTP header (X-XSRF-TOKEN). Since only JavaScript that runs on your domain can read the cookie, your server can be assured that the XHR came from JavaScript running on your domain.
*/
export function validateCsrf(req, res, next) {
  if (req.app.get("ctx").config.env === "development") {
    req.csrf = true;
  } else {
    req.csrf =
      req.session.csrfToken === req.headers["x-xsrf-token"] ? true : false;
  }
  next();
}
