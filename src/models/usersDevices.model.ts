import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { User } from "@app/models/user.model";
import { Device } from "@app/models/device.model";
import { RichRequest } from "@app/interfaces/RichRequest";

@Table({ tableName: "users_devices", updatedAt: false })
class IUsersDevices extends Model<IUsersDevices> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ field: "user_id" })
  userId!: number;

  @ForeignKey(() => Device)
  @PrimaryKey
  @Column({ field: "device_id" })
  deviceId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @BelongsTo(() => Device)
  public device!: Device;

}

export class UsersDevices extends IUsersDevices {
  static async addLinkIfNotExists(user: User, req: RichRequest) {
    if (!req.device) return;
    await this.findOrCreate({
      where: { userId: user.userId, deviceId: req.device.deviceId },
      defaults: { userId: user.userId, deviceId: req.device.deviceId }
    });

  }
}
