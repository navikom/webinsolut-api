import { NextFunction, Request, Response } from "express";
import session from "express-session";
import { db } from "@app/models";
import CONFIG from "@app/config/config";
import { RichRequest } from "@app/interfaces/RichRequest";

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const SessionSequelizeStore = require("@app/models/sessionSequelize")(SequelizeStore);

const extendDefaultFields = (req: RichRequest, res: Response) => (defaults: any, session: any) => {
  console.log("extendDefaultFields", session.id, req.device && req.device.deviceId);
  res.cookie("sid", session.id);
  return {
    data: {},
    expires: defaults.expires,
    userId: 0,
    deviceId: req.device ? req.device.deviceId : null,
  };
};

export default async function (req: Request, res: Response, next: NextFunction) {
  session({
    secret: CONFIG.jwt_encryption,
    store: new SessionSequelizeStore({
      db,
      table: "ISession",
      checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
      expiration: parseInt(CONFIG.jwt_expiration) * 1000,  // The maximum age (in milliseconds) of a valid session.
      extendDefaultFields: extendDefaultFields(req as RichRequest, res),
      request: () => req
    }),
    cookie: { secure: false, httpOnly: false },
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
    saveUninitialized: true
  })(req, res, next);
}
