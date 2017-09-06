import { IAppConfig, appConfig } from "./config/appConfig";
import * as path from "path";
import * as massive from "massive";
import * as monitor from "pg-monitor";
import * as Redis from "ioredis";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import OpticsAgent from "optics-agent";
import glob = require("glob");
import deepmerge = require("deepmerge");

interface IAppContext {
  config: IAppConfig;
  db: massive.Database | any;
  redisClient: Redis.Redis;
}

interface IAppOptions {
  monitorSQL: boolean;
}

export default class App {
  public graphqlSchema: GraphQLSchema;
  private db: massive.Database | any;
  private redisClient: Redis.Redis;

  async start(options: IAppOptions = { monitorSQL: true }): Promise<App> {
    let shema = await this.createSchema();
    this.graphqlSchema = new GraphQLSchema(shema);

    if (appConfig.opticsApiKey) {
      OpticsAgent.instrumentSchema(this.graphqlSchema);
    }

    this.db = await this.instantiateMassive();
    if (options.monitorSQL) monitor.attach(this.db.driverConfig);

    this.redisClient = new Redis();

    return this;
  }

  stop(): void {
    this.db.pgp.end();
    this.redisClient.quit();
  }

  get ctx(): IAppContext {
    return {
      config: appConfig,
      db: this.db,
      redisClient: this.redisClient
    };
  }

  async instantiateMassive(): Promise<massive.Database> {
    return massive({
      host: appConfig.pgHost,
      port: appConfig.pgPort,
      database: appConfig.pgDBname,
      user: appConfig.pgUserName,
      password: appConfig.pgPassword
    });
  }

  async createSchema(): Promise<any> {
    let files: string[] = await this.getShemaFiles();
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
    return {
      query: new GraphQLObjectType(queryMap),
      mutation: new GraphQLObjectType(mutationMap)
    };
  }

  async getShemaFiles(): Promise<any> {
    let pattern = path.resolve(__dirname, "./schema/**/*.ts");
    return await new Promise<string[]>((resolve, reject) => {
      glob(pattern, { ignore: ["**/*.test.ts"] }, (err, files) => {
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
