import * as session from "express-session";
import * as express from "express";

interface EnchancedRequest {
  session: session;
  user: any;
  csrf: any;
}
export type Request = EnchancedRequest & express.Request;
