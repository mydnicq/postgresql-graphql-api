import * as data from "./database.json";

const dbConfig = process.env.NODE_ENV
  ? data[process.env.NODE_ENV]
  : data["development"];

class Config {
  public readonly appName: string;
  public readonly env: string;
  public readonly httpPort: number;
  public readonly httpHost: string;
  public readonly pgPort: number;
  public readonly pgHost: string;
  public readonly pgDBname: string;
  public readonly pgUserName: string;
  public readonly pgPassword: string;
  public readonly pgMonitor: boolean;
  public readonly sessionSecret: string;
  public readonly sessionMaxAge: number;
  public readonly requestRateLimit: string | number;
  public readonly allowOrigin: string;

  public constructor() {
    this.appName = process.env.APP_NAME || "myapp";
    this.env = process.env.NODE_ENV || "development";
    this.httpPort = Number(process.env.HTTP_PORT) || 5566;
    this.httpHost = process.env.HTTP_HOST || "0.0.0.0";
    this.pgPort = process.env.DB_PORT || dbConfig.port;
    this.pgHost = process.env.DB_HOST || dbConfig.host;
    this.pgDBname = process.env.DB_NAME || dbConfig.database;
    this.pgUserName = process.env.DB_USER_NAME || dbConfig.user;
    this.pgPassword = process.env.DB_PASSWORD || dbConfig.password;
    this.pgMonitor = dbConfig.monitorSql || false;
    this.sessionSecret = process.env.SESSION_SECRET || "mysecret";
    // Session lifetime in milliseconds
    this.sessionMaxAge = Number(process.env.SESSION_MAX_AGE) || 2592000000;
    // Request rate limit per minute
    this.requestRateLimit = process.env.RATE_LIMIT || 100;
    // Access-Control-Allow-Origin CORS header can be string to restrict allowed origin (i.e. http://localhost:4444)
    // or true/false to completely enable/disable CORS
    this.allowOrigin = "http://localhost";
  }
}

export default new Config();
