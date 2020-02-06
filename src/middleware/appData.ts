import {RichRequest} from '@app/interfaces/RichRequest';
import {Request, Response, NextFunction} from 'express';
import {CookieType} from '@app/models/types/models';
import {getCookies} from '@app/helpers/HTTPRequest';
import {App} from '@app/models/app.model';
import {HTTPStatus} from '@app/helpers/HTTPStatus';

export default async function (req: Request, res: Response, next: NextFunction) {
  (async function(req, res, next) {
    const cookie: CookieType = getCookies(req);
    if(cookie.APP) {
      req.iapp = await App.findByTitle(cookie.APP);
      if(!req.iapp) {
        return res.status(HTTPStatus.NOT_ACCEPTABLE).send(HTTPStatus.APP_HASNT_FOUND.replace('$', cookie.APP));
      }
    } else {
      req.iapp = null;
    }
    next();
  })(req as RichRequest, res, next);

}
