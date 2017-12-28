import Config from "../config";
import * as interfaces from "../interfaces";
import { Server } from "../core";
import { graphiqlExpress, ExpressHandler } from "graphql-server-express";

export default class GraphiqlRoute implements interfaces.Route {
  public setRoute(): void {
    if (Config.env === "development") {
      Server.getInstance().use(
        "/graphiql",
        graphiqlExpress({
          endpointURL: "/graphql"
        })
      );
    }
  }
}
