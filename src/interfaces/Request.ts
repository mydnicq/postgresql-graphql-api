import * as session from "express-session";
import * as express from "express";

export interface Request extends express.Request {
  session: session;
  user: any;
  csrf: any;
}
