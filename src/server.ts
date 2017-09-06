import * as express from "express";
import * as bodyParser from "body-parser";
import * as Csrf from "csrf";
import * as passport from "passport";
import rateLimiterlMiddleware from "./middlewares/rateLimiter";
import graphqlMiddleware from "./middlewares/graphql";
import * as sessionMiddleware from "./middlewares/session";
import * as authMiddleware from "./middlewares/auth";
import { graphiqlExpress } from "graphql-server-express";
import App from "./app";
import OpticsAgent from "optics-agent";
import cors = require("cors");
import logger from "./middlewares/logger";

export default class Server {
  server: express.Application;
  csrfTokens: Csrf;

  constructor(public app: App) {
    this.csrfTokens = new Csrf();
  }

  async start(): Promise<any> {
    if (this.server) return this;

    this.server = express();
    this.server.set("ctx", this.app.ctx);

    this.server.use(logger(this.app));

    // Set the ip-address of your trusted reverse proxy server such as
    // haproxy or Apache mod proxy or nginx configured as proxy or others.
    // The proxy server should insert the ip address of the remote client
    // through request header 'X-Forwarded-For' as
    // 'X-Forwarded-For: some.client.ip.address'
    this.server.set("trust proxy", "loopback");

    this.server
      .use(cors({ origin: this.app.ctx.config.allowOrigin }))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

    this.server.use(rateLimiterlMiddleware(this.app));

    this.server.use(sessionMiddleware.instantiateSession(this.app));

    // Passport
    this.server.use(passport.initialize());
    authMiddleware.addLocalStrategy(this.app);
    this.server.post(
      "/auth",
      passport.authenticate("local", { session: false }),
      sessionMiddleware.initializeSession(this.app, this.csrfTokens)
    );

    // GraphQL
    if (this.app.ctx.config.opticsApiKey) {
      this.server.use(OpticsAgent.middleware());
    }
    this.server.use(
      "/graphql",
      authMiddleware.validateCsrf,
      graphqlMiddleware(this.app)
    );
    if (this.app.ctx.config.env === "development") {
      this.server.use(
        "/graphiql",
        graphiqlExpress({
          endpointURL: "/graphql"
        })
      );
    }

    return new Promise(resolve => {
      let { httpPort, httpHost } = this.app.ctx.config;
      let resolver = () =>
        resolve(
          `PostgreSQL GraphQL API Server is listening on port ${httpPort}`
        );
      this.server.listen(httpPort, httpHost, resolver);
    });
  }

  stop(): void {
    console.log("PostgreSQL GraphQL API Server stopped.");
    process.exit(0);
  }
}
