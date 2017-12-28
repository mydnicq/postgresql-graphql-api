import Config from "../config";
import * as express from "express";
import * as Csrf from "csrf";
import { MiddlewareBuilder } from "../middlewares";
import { RouteBuilder } from "../routes";

export class Server {
  private static _server: express.Application;
  private static _csrfTokens: Csrf;

  public static async start(): Promise<any> {
    this._server = express();
    this._csrfTokens = new Csrf();

    // Set the ip-address of your trusted reverse proxy server such as
    // haproxy or Apache mod proxy or nginx configured as proxy or others.
    // The proxy server should insert the ip address of the remote client
    // through request header 'X-Forwarded-For' as
    // 'X-Forwarded-For: some.client.ip.address'
    this._server.set("trust proxy", "loopback");

    await MiddlewareBuilder.make();

    await RouteBuilder.make();

    return new Promise(resolve => {
      let { httpPort, httpHost } = Config;
      let resolver = () =>
        resolve(
          `PostgreSQL GraphQL API Server is listening on port ${httpPort}`
        );
      this._server.listen(httpPort, httpHost, resolver);
    });
  }

  public static getInstance(): express.Application {
    return this._server;
  }

  public static getCsrfTokens(): Csrf {
    return this._csrfTokens;
  }

  public static stop(): void {
    console.log("PostgreSQL GraphQL API Server stopped.");
    process.exit(0);
  }
}
