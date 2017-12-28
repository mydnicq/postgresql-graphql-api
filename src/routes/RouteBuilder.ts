import * as path from "path";
import glob = require("glob");

export class RouteBuilder {
  public static async make() {
    let files = await this._getRouteFiles();
    files.forEach(file => {
      let route = require(file).default;
      new route().setRoute();
    });
  }

  private static async _getRouteFiles(): Promise<any> {
    let pattern = path.resolve(__dirname, "./**/*Route.ts");
    return await new Promise<string[]>((resolve, reject) => {
      glob(pattern, { ignore: ["**/*.d.ts"] }, (err, files) => {
        if (err || files.length === 0) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    }).catch(e => {
      throw new Error("Cannot find route files.");
    });
  }
}
