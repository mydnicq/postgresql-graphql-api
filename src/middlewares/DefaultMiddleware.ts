import Config from "../config";
import * as interfaces from "../interfaces";
import { Server } from "../core";
import * as bodyParser from "body-parser";
import cors = require("cors");

export default class DefaultMiddleware implements interfaces.Middleware {
  public setMiddleware() {
    Server.getInstance()
      .use(cors({ origin: Config.allowOrigin }))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));
  }
}
