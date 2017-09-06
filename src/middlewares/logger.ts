import App from "../app";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";
import rfs = require("rotating-file-stream");

export default function(app: App) {
  if (app.ctx.config.env === "development") {
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
