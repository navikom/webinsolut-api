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

@Table({ tableName: "android_targets", timestamps: true, paranoid: true })
export class AndroidTarget extends Model<AndroidTarget> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "android_target_id" })
  public androidTargetId!: number;

  @Column({ type: DataType.NUMBER, field: "app_id" })
  public appId!: number;

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
