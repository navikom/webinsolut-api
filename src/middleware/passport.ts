import {Request, Response} from 'express';
import {HTTPStatus} from '@app/helpers/HTTPStatus';
import {RichRequest} from '@app/interfaces/RichRequest';
import CONFIG from '@app/config/config';
import {SessionService} from '@app/services/session.service';

export default function () {

  return async function (req: Request | RichRequest, res: Response, next: Function) {
    const request = req as RichRequest;
    if (!request.session || request.session!.anonymous) {
      return res.status(HTTPStatus.UNAUTHORIZED).send(HTTPStatus.UNAUTHORIZED_MESSAGE);
    }
    if(request.session!.deletedAt) {
      return res.status(HTTPStatus.NOT_ACCEPTABLE).send(HTTPStatus.SESSION_ALREADY_DELETED);
    }
    const expires: Date = new Date(request.session!.updatedAt.getTime() + parseInt(CONFIG.jwt_expiration) * 1000);
    if(expires < new Date()) {
      SessionService.destroy(request);
      return res.status(HTTPStatus.NOT_ACCEPTABLE).send(HTTPStatus.SESSION_EXPIRED);
    }
    next();
  }
};
