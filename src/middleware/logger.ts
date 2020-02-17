import { Request, Response } from "express";
import { Logs } from "@app/models/request.model";

export default function (req: Request, res: Response, next: Function) {
  Logs.create({
    url: req.url, token: req.session ? req.session.sid : null, method: req.method
  });
  next();
}
