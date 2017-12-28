import Config from "../config";
import { Database, RedisClient, Server } from "../core";
import { SchemaBuilder } from "../schema";

export class CreateApp {
  public static async start(): Promise<any> {
    await Database.init();
    await SchemaBuilder.make();
    RedisClient.init();

    let serverStatus = await Server.start();
    console.log(serverStatus);
    return this;
  }

  public stop(): void {
    Database.destroyInstance();
    RedisClient.destroyInstance();
    Server.stop();
  }
}
