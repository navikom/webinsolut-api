import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import App from "@app/models/app.model";
import { Image } from "@app/models/image.model";

@Table({ tableName: "apps_images" })
export class AppsImages extends Model<AppsImages> {

  @ForeignKey(() => App)
  @PrimaryKey
  @Column({ field: "app_id" })
  public appId!: number;

  @ForeignKey(() => Image)
  @PrimaryKey
  @Column({ field: "image_id" })
  public imageId!: number;

  @Column(DataType.NUMBER)
  public sorting!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  public updatedAt!: Date;
}
