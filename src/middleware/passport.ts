import { Request, Response } from "express";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

export default function () {

  return async function (req: Request, res: Response, next: Function) {
    if (!req.session || !req.session!.authorized) {
      return res.status(HTTPStatus.UNAUTHORIZED).send(HTTPStatus.UNAUTHORIZED_MESSAGE);
    }
    next();
  }
};
