import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default, DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { Request } from "express";
import { IRegion } from "@app/models/region.model";
import {
  AtLeastOnceType, DateTypes,
  EmailType,
  InAppType,
  NumberTypes,
  OnceType,
  PushType,
  SmsType, StringTypes, VisitorType
} from "@app/models/types/models";
import { NumberExpressionFn } from "@app/utils/stringBuilder";

const dictionary = {
  userData: {
    visitorType: {
      "All Users": ""
    }
  }
};

@Table({ tableName: "segments", timestamps: true, paranoid: true })
class ISegment extends Model<ISegment> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "segment_id" })
  public segmentId!: number;

  @Column(DataType.STRING)
  public name!: string;

  @Column({ type: DataType.JSONB, field: "user_data" })
  public userData!: any;

  @Column(DataType.JSONB)
  public behavior!: any;

  @Column(DataType.JSONB)
  public technology!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  public updatedAt!: Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  public deletedAt!: Date;
}

interface INumberFilter {
  is?: NumberTypes;
  value?: number;
  values?: number[];
  min?: number;
  max?: number;
}

interface IDateFilter {
  is?: DateTypes;
  date?: Date;
  from?: Date;
  to?: Date;
}

interface IStringFilter {
  is?: StringTypes;
  value?: string | boolean;
  values?: string[];
}

interface IVisitor {
  name: string;
}

interface INumberOfSessions extends INumberFilter, IVisitor {
}

interface IGeo {
  include: IRegion[] | null;
  exclude: IRegion[] | null;
}

interface IAttribute {
  property: string;
  expression: IStringFilter | INumberFilter | IDateFilter;
}

export type AndType = "and";
export type OrType = "or";

type AttributeType =
  | IAttribute
  | (IAttribute | AndType | OrType)[]
  | null;

type ChannelType = EmailType | SmsType | InAppType | PushType;

interface IReachability {
  on: boolean;
  value: ChannelType;
}

const VisitorTypeFn: {[key: string]: (key: any, value?: number | number[]) => string} = {
  "New Users": () => "created_at >= now() - interval '24 hours'",
  "Returning": () => "last_session > created_at + interval '24 hours'",
  "No. of Sessions": (key: keyof typeof NumberExpressionFn, value?: number | number[]) => NumberExpressionFn[key]("session", value)
};

interface IUserData {
  visitorType: INumberOfSessions;
  lastSeen: IDateFilter | null;
  geo: IGeo | null;
  attributes: AttributeType;
  reachability: IReachability | null;
}

interface IOccurs {
  is?: AtLeastOnceType | OnceType | NumberTypes;
  value?: number | boolean | number[];
  min?: number;
  max?: number;
}

interface IBehaviorEvent {
  name: string;
  occurs: IOccurs;
}

type BehaviorType =
  | IBehaviorEvent
  | (IBehaviorEvent | AndType | OrType)[]
  | null;

interface IBehavior {
  usersWhoDidEvents: BehaviorType;
  and: boolean;
  usersWhoDidNotDoEvents: BehaviorType;
}

interface ISegmentDevice {
  appInstallationDate?: IDateFilter;
  lastSeen?: IDateFilter;
  totalTimeSpent?: INumberFilter;
  appVersionName?: IStringFilter;
  appId?: IStringFilter;
  appVersionCode?: INumberFilter;
  advertisingId?: INumberFilter;
  apiVersion?: INumberFilter;
  sdkVersion?: INumberFilter;
  model?: IStringFilter;
  locale?: IStringFilter;
}

interface IAndroidDevice extends ISegmentDevice {
  androidId?: INumberFilter;
  manufacturer?: IStringFilter;
  brand?: IStringFilter;
}

interface IIOSDevice extends ISegmentDevice {
  vendorId?: INumberFilter;
}

interface ITechnology {
  android?: IAndroidDevice | null;
  ios?: IIOSDevice | null;
}

interface ISegmentBody {
  userData: IUserData;
  behavior?: IBehavior;
  technology?: ITechnology;
}

const convertToQueries = (body: ISegmentBody) => {
  const where: string[] = [];
  const visitor = body.userData.visitorType.name as keyof typeof VisitorTypeFn;
  const is = body.userData.visitorType.is;

  const value = body.userData.visitorType.value
    || body.userData.visitorType.values
    || (body.userData.visitorType.min
      && [body.userData.visitorType.min, body.userData.visitorType.max]) as number | number[] | undefined;

  if(visitor) {
    VisitorTypeFn[visitor] && where.push(VisitorTypeFn[visitor](is, value));
  }

  const queryIds = `Select userId from users;`;
  const queryCount = `Select COUNT(*) from users;`;

  return { ids: queryIds, count: queryCount };
};

export class Segment extends ISegment {

  static save(req: Request) {
    const segmentId = req.body.segmentId;
    const querystring = convertToQueries(req.body);
    const body = {
      name: req.body.name,
      userData: req.body.userData,
      behavior: req.body.behavior,
      technology: req.body.technology,
    } as ISegment;
    if (segmentId === 0) {
      return this.create(body);
    } else {
      return this.updateOne(segmentId, body);
    }
  }

  static async updateOne(segmentId: number, body: ISegment) {
    const segment = await this.findByPk(segmentId);
    return segment?.update(body);
  }

}
