import App from "../app";
import RateLimiter = require("ratelimiter");
import RateLimitError from "../errors/rateLimitError";

export default function(app: App) {
  return function(req, res, next) {
    const limiter = new RateLimiter({
      id: req.ip,
      db: app.ctx.redisClient,
      max: app.ctx.config.requestRateLimit,
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
