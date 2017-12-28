import * as Redis from "ioredis";

export class RedisClient {
  private static _instance: Redis.Redis;

  public static init() {
    this._instance = new Redis();
  }

  public static getInstance(): Redis.Redis {
    return this._instance;
  }

  public static destroyInstance(): void {
    if (this._instance) this._instance.quit();
  }
}
