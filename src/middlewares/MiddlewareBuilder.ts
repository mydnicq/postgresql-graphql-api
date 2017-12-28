import * as path from "path";
import glob = require("glob");

export class MiddlewareBuilder {
  public static async make() {
    let files = await this._getMiddlewareFiles();
    files.forEach(file => {
      let middleware = require(file).default;
      new middleware().setMiddleware();
    });
  }

  private static async _getMiddlewareFiles(): Promise<any> {
    let pattern = path.resolve(__dirname, "./**/*Middleware.ts");
    return await new Promise<string[]>((resolve, reject) => {
      glob(pattern, { ignore: ["**/*.d.ts"] }, (err, files) => {
        if (err || files.length === 0) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    }).catch(e => {
      throw new Error("Cannot find middleware files.");
    });
  }
}
