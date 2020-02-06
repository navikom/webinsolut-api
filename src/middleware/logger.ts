import {Request, Response} from 'express';
import {getCookies} from '@app/helpers/HTTPRequest';
import {Logs} from '@app/models/request.model';

export default function (req: Request, res: Response, next: Function) {
  const app = getCookies(req).app;
  Logs.create({
    url: req.url, app: app? app : null, token: req.headers.authorization, method: req.method
  });
  next();
}
