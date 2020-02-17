import {
  BelongsTo,
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
import { RichRequest } from "@app/interfaces/RichRequest";
import { Region } from "@app/models/region.model";
import { Role } from "@app/models/role.model";

@Table({ tableName: "users_regions", updatedAt: false })
class IUsersRegions extends Model<IUsersRegions> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ field: "user_id" })
  userId!: number;

  @ForeignKey(() => Region)
  @PrimaryKey
  @Column({ field: "region_id" })
  regionId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @BelongsTo(() => Region)
  region!: Region;

}

export class UsersRegions extends IUsersRegions {
  static async addLinkIfNotExists(user: User, req: RichRequest) {
    if (!req.region) return;
    await this.findOrCreate({
      where: { userId: user.userId, regionId: req.region.regionId },
      defaults: { userId: user.userId, regionId: req.region.regionId }
    });

  }
}
