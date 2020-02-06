import {RichRequest} from '@app/interfaces/RichRequest';
import {Session} from '@app/models/session.model';

export class SessionService {
  static async destroy(req: RichRequest) {
    await req.session!.destroy();
  }

  static async create(req: RichRequest, anonymous: boolean) {
    req.session = await Session.create({userId: req.iuser!.userId, anonymous, deviceId: req.device!.deviceId});
  }
}
