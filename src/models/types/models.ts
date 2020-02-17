import { IUser } from "@app/models/user.model";
import { Column, DataType } from "sequelize-typescript";
import { randomId, randomInt } from "@app/utils/utils";

export type LoginSuccessResponse = {
  anonymous: boolean,
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

export type EmailType = 1;
export type SmsType = 2;
export type InAppType = 3;
export type PushType = 4;

export type GreaterThanType = "greater than";
export type LessThanType = "less than";
export type EqualType = "equal to";
export type DoesNotEqualType = "does not equal to";
export type IsGreaterThanOrEqualType = "is greater than or equal to";
export type IsLessThanOrEqualType = "is less than or equal to";
export type AtLeastOnceType = "at least once";
export type NotOnceType = "not once";
export type OnceType = "once";
export type BetweenType = "between";
export type NotBetweenType = "not between";
export type EmptyType = "is empty";
export type IsNotEmptyType = "is not empty";
export type OneOfType = "one of";
export type NoneOneOfType = "none one of";
export type AndType = "and";
export type OrType = "or";
export type StartsWithType = "starts with";
export type DoesNotStartWithType = "does not start with";
export type EndsWithType = "ends with";
export type DoesNotEndWithType = "does not end with";
export type ContainsType = "contains";
export type BeforeType = "before";
export type AfterType = "after";
export type WithingType = "withing";
export type IncludeType = "include";
export type ExcludeType = "exclude";

export type AllUsersType = "All Users";
export type NewUsersType = "New Users";
export type ReturningType = "Returning";
export type NoSessionsType = "No. of Sessions";

export type VisitorType = AllUsersType | NewUsersType | ReturningType | NoSessionsType;

export type DateTypes = BeforeType | AfterType | WithingType;
export type NumberTypes =
  | GreaterThanType
  | LessThanType
  | EqualType
  | DoesNotEqualType
  | IsGreaterThanOrEqualType
  | IsLessThanOrEqualType
  | BetweenType
  | NotBetweenType
  | OneOfType
  | NoneOneOfType
  | EmptyType
  | IsNotEmptyType;

export type StringTypes =
  | EqualType
  | DoesNotEqualType
  | OneOfType
  | NoneOneOfType
  | EndsWithType
  | DoesNotEndWithType
  | StartsWithType
  | DoesNotStartWithType
  | ContainsType
  | EmptyType
  | IsNotEmptyType;
