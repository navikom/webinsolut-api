import {Request} from 'express';
import {Device} from '@app/models/device.model';
import {Region} from '@app/models/region.model';
import {User} from '@app/models/user.model';
import {App} from '@app/models/app.model';
import {Session} from '@app/models/session.model';
export interface RichRequest extends Request {
  device: Device | null;
  region: Region | null;
  session: Session | null;
  iuser: User | null;
  iapp: App | null;
}
