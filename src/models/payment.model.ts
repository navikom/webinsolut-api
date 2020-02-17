import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType, Default, DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table, UpdatedAt
} from "sequelize-typescript";
import { User } from "@app/models/user.model";

@Table({ tableName: "payments", timestamps: true, paranoid: true })
export class Payment extends Model<Payment> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "payment_id" })
  public paymentId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.NUMBER, field: "user_id" })
  public userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @Column(DataType.STRING)
  public title!: string;

  @Column(DataType.JSONB)
  public info!: typeof Object;

  @Column(DataType.DOUBLE)
  public payment!: number;

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
