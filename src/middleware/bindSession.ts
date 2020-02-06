import {RichRequest} from '@app/interfaces/RichRequest';
import {Request, Response, NextFunction} from 'express';
import {CookieType} from '@app/models/types/models';
import {getCookies} from '@app/helpers/HTTPRequest';
import {Session} from '@app/models/session.model';

export default async function (req: Request, res: Response, next: NextFunction) {
  (async function(req, res, next) {
    const cookie: CookieType = getCookies(req);
    if(cookie.SESSION) {
      req.session = await Session.findById(Number(cookie.SESSION));
      if(req.session && req.session!.deletedAt) {
        req.session = null;
      }
    } else {
      req.session = null;
    }
    next();
  })(req as RichRequest, res, next);

}
