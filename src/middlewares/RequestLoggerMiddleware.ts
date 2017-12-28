import Config from "../config";
import * as interfaces from "../interfaces";
import { Server } from "../core";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";
import rfs = require("rotating-file-stream");

export default class RequestLoggerMiddleware implements interfaces.Middleware {
  public setMiddleware() {
    Server.getInstance().use(this._handler());
  }

  private _handler(): morgan {
    if (Config.env === "development") {
      return morgan("dev");
    } else {
      const logDirectory = path.resolve(__dirname, "..", "..", "log");
      fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

      const accessLogStream = rfs("access.log", {
        interval: "1d",
        path: logDirectory
      });
      return morgan("combined", { stream: accessLogStream });
    }
  }
}
