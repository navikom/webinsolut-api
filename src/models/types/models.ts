import {IUser} from '@app/models/user.model';
import {Column, DataType} from 'sequelize-typescript';

export type LoginSuccessResponse = {
  session: number,
  anonymous: boolean,
  expires: number,
  user: IUser
}

export type CookieType = {
  [key: string]: string;
}

export type DataOS = {
  name?: string;
  version?: number;
}

export type DeviceInfoType = {
  OS: DataOS;
  BROWSER: DataOS;
  headers: string;
}

export type RegionType = {
  country?: string;
  region?: string;
  timezone?: string;
  city?: string;
  ip?: string;
  lt?: number;
  lg?: number;
}
