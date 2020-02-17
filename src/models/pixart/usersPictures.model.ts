import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { User } from "@app/models/user.model";
import { PixartPicture } from "@app/models/pixart/picture.model";

@Table({ tableName: "pixart_users_pictures", timestamps: true, paranoid: true })
export class PixartUsersPictures extends Model<PixartUsersPictures> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ field: "user_id" })
  public userId!: number;

  @ForeignKey(() => PixartPicture)
  @PrimaryKey
  @Column({ field: "picture_id" })
  public pictureId!: number;

  @Column(DataType.JSON)
  public info!: any;

  @Column(DataType.STRING)
  public name!: string;

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

  @BelongsTo(() => User)
  public user!: User;
}
