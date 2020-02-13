import { IUser } from '@app/models/user.model';
import { Column, DataType } from 'sequelize-typescript';
import { randomId, randomInt } from '@app/utils/utils';

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

export type AndroidDeviceType = {
  androidId: string;
  release: number;
  sdk: number;
  manufacturer: string;
  brand: string;
  model: string;
  device: string;
}

export type IOSDeviceType = {
  name: string;
  systemName: string;
  systemVersion: string;
  model: string;
  localizedModel: string;
  vendorId: string;
  release: Date;
}

export type DeviceType = AndroidDeviceType | IOSDeviceType;
