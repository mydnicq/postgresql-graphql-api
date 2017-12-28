import Config from "../config";
import * as express from "express";
import * as interfaces from "../interfaces";
import { Server, RedisClient } from "../core";
import RateLimiter = require("ratelimiter");
import RateLimitError from "../errors/rateLimitError";

export default class RateLimiterMiddleware implements interfaces.Middleware {
  public setMiddleware() {
    Server.getInstance().use(this._handler());
  }

  private _handler() {
    return function(
      req: express.Request,
      res: express.Response,
      next: () => void
    ) {
      const limiter = new RateLimiter({
        id: req.ip,
        db: RedisClient.getInstance(),
        max: Config.requestRateLimit,
        duration: 60000
      });
      limiter.get(function(err, limit) {
        if (err) return next();
        if (limit.remaining) return next();
        return res.send(
          JSON.stringify({ errors: new RateLimitError("Rate limit exceeded.") })
        );
      });
    };
  }
}
