import * as data from "./database.json";

const dbConfig = process.env.NODE_ENV
  ? data[process.env.NODE_ENV]
  : data["development"];

export interface IAppConfig {
  appName: string;
  env: string;
  httpPort: number;
  httpHost: string;
  pgPort: number;
  pgHost: string;
  pgDBname: string;
  pgUserName: string;
  pgPassword: string;
  sessionSecret: string;
  opticsApiKey: string;
  sessionMaxAge: number;
  requestRateLimit: number;
  allowOrigin: string;
}

export const appConfig: IAppConfig = {
  // Should be in ASCII
  appName: process.env.APP_NAME || "myapp",
  env: process.env.NODE_ENV || "development",
  httpPort: process.env.HTTP_PORT || 5566,
  httpHost: process.env.HTTP_HOST || "0.0.0.0",
  pgPort: process.env.DB_PORT || dbConfig.port,
  pgHost: process.env.DB_HOST || dbConfig.host,
  pgDBname: process.env.DB_NAME || dbConfig.database,
  pgUserName: process.env.DB_USER_NAME || dbConfig.user,
  pgPassword: process.env.DB_PASSWORD || dbConfig.password,
  sessionSecret: process.env.SESSION_SECRET || "mysecret",
  // Apollo Optics API KEY
  opticsApiKey: process.env.OPTICS_API_KEY,
  // Session lifetime
  sessionMaxAge: process.env.SESSION_MAX_AGE || 2592000000, // In milliseconds
  // Request rate limit per minute
  requestRateLimit: process.env.RATE_LIMIT || 100,
  // Access-Control-Allow-Origin CORS header can be string to restrict allowed origin (i.e. http://localhost:4444)
  // or true/false to completely enable/disable CORS
  allowOrigin: "http://localhost"
};
