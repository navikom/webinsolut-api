import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model, NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Request } from "express";
import EventsService from "@app/services/event.service";
import { Device } from "@app/models/device.model";
import App from "@app/models/app.model";
import { IUser } from "@app/models/user.model";
import { RichRequest } from "@app/interfaces/RichRequest";

@Table({ tableName: "crashes", updatedAt: false })
class ICrash extends Model<ICrash> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "crash_id" })
  public crashId!: number;

  @Column({ type: DataType.NUMBER, field: "user_id" })
  public userId!: number;

  @NotNull
  @Column({ type: DataType.JSONB, allowNull: false })
  public info!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @NotNull
  @Column({ type: DataType.NUMBER, field: "device_id", allowNull: false })
  public deviceId!: number;

  @Column(DataType.STRING)
  public app!: string;

}

export class Crash extends ICrash {
  static async createOne(req: RichRequest) {
    EventsService.appCrashed(req);
    this.create(req.body);
    return true;
  }
}
