import * as path from "path";
import glob = require("glob");
import deepmerge = require("deepmerge");
import { GraphQLSchema, GraphQLObjectType } from "graphql";

export class SchemaBuilder {
  private static _schema: GraphQLSchema;

  public static async make(): Promise<GraphQLSchema> {
    let files: string[] = await this._getShemaFiles();
    let queryMap = files
      .map(file => require(file).queryType)
      .filter(f => f)
      .reduce((a, b) => {
        return deepmerge(a, b);
      }, {});
    let mutationMap = files
      .map(file => require(file).mutationType)
      .filter(f => f)
      .reduce((a, b) => {
        return deepmerge(a, b);
      }, {});
    this._schema = new GraphQLSchema({
      query: new GraphQLObjectType(queryMap),
      mutation: new GraphQLObjectType(mutationMap)
    });
    return this._schema;
  }

  public static getSchema() {
    return this._schema;
  }

  private static async _getShemaFiles(): Promise<any> {
    let pattern = path.resolve(__dirname, "./**/*.ts");
    return await new Promise<string[]>((resolve, reject) => {
      glob(pattern, { ignore: ["**/*.d.ts"] }, (err, files) => {
        if (err || files.length === 0) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    }).catch(e => {
      throw new Error("Cannot find schema files.");
    });
  }
}
