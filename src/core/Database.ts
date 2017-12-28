import Config from "../config";
import * as massive from "massive";
import * as monitor from "pg-monitor";

export class Database {
  private static _instance: massive.Database | any;

  public static async init(): Promise<massive.Database> {
    this._instance = await massive({
      host: Config.pgHost,
      port: Config.pgPort,
      database: Config.pgDBname,
      user: Config.pgUserName,
      password: Config.pgPassword
    });
    if (Config.pgMonitor) monitor.attach(this._instance.driverConfig);
    return this._instance;
  }

  public static getInstance(): massive.Database {
    if (!this._instance) {
      throw new Error("Database instance hasn't been instantiated yet.");
    }
    return this._instance;
  }

  public static destroyInstance(): void {
    if (this._instance) this._instance.pgp.end();
  }
}
