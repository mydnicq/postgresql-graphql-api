import App from "../app";
import { graphqlExpress } from "graphql-server-express";
import OpticsAgent from "optics-agent";
import * as express from "express";
import queryComplexity from "graphql-query-complexity";

/*
 * Returns a GraphQL middleware.
 */
export default function(app: App) {
  return graphqlExpress((req: express.Request) => ({
    schema: app.graphqlSchema,
    context: createContext(app, req),
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

function createContext(app: App, req: express.Request | any): object {
  return Object.assign(app.ctx, {
    viewer: req.session.viewer,
    isValidCsrf: req.csrf,
    opticsContext: app.ctx.config.opticsApiKey ? OpticsAgent.context(req) : null
  });
}
