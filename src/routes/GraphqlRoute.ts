import Config from "../config";
import * as interfaces from "../interfaces";
import { Server, Database } from "../core";
import { SchemaBuilder } from "../schema";
import * as express from "express";
import { graphqlExpress, ExpressHandler } from "graphql-server-express";
import queryComplexity from "graphql-query-complexity";

export default class GraphqlRoute implements interfaces.Route {
  public setRoute(): void {
    Server.getInstance().use(
      "/graphql",
      this._validateCsrf(),
      this._routeHandler()
    );
  }

  private _routeHandler(): ExpressHandler {
    return graphqlExpress((req: interfaces.Request) => ({
      schema: SchemaBuilder.getSchema(),
      context: {
        db: Database.getInstance(),
        viewer: req.session.viewer,
        isValidCsrf: req.csrf
      },
      formatError(error) {
        return {
          message: error.message,
          state: error.originalError && error.originalError.state,
          code: error.originalError && error.originalError.code,
          path: error.path
        };
      },
      validationRules: [
        queryComplexity({
          maximumComplexity: 1000,
          variables: {},
          onComplete: (complexity: number) => {
            console.log("Query Complexity:", complexity);
          }
        })
      ]
    }));
  }

  /*
  When performing XHR requests, the $http service reads a token from a cookie (by default, XSRF-TOKEN) 
  and sets it as an HTTP header (X-XSRF-TOKEN). Since only JavaScript that runs on your domain can read the cookie, 
  your server can be assured that the XHR came from JavaScript running on your domain.
  */
  private _validateCsrf() {
    return function(
      req: interfaces.Request,
      res: express.Response,
      next: () => void
    ) {
      if (Config.env === "development") {
        req.csrf = true;
      } else {
        req.csrf =
          req.session.csrfToken === req.headers["x-xsrf-token"] ? true : false;
      }
      next();
    };
  }
}
