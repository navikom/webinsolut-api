import {Request, Response} from 'express';
import AuthService from '@app/services/auth.service';
import {RichRequest} from '@app/interfaces/RichRequest';

export default async function (req: Request, res: Response, next: Function) {
  (async function(req, res, next) {
    if(!req.session) return next();
    const user = await AuthService.getUserById(req.session.userId);
    req.user = user;
    req.iuser = user;
    next();
  })(req as RichRequest, res, next);
}
