import { Request, Response } from "express";
import AuthService from "@app/services/auth.service";
import { RichRequest } from "@app/interfaces/RichRequest";
import { User } from "@app/models/user.model";

export default async function (req: Request, res: Response, next: Function) {
  (async function (req, res, next) {
    if (!req.session) return next();
    if(!req.session.user) {
      await User.createAndAssignToSession(req.session);
    }
    next();
  })(req as RichRequest, res, next);
}
