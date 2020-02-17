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
import { WithdrawMethod } from "@app/models/withdrawMethod.model";

@Table({ tableName: "users_withdraw_methods", updatedAt: false })
export class UsersWithdrawMethods extends Model<UsersWithdrawMethods> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ field: "user_id" })
  public userId!: number;

  @ForeignKey(() => WithdrawMethod)
  @PrimaryKey
  @Column({ field: "withdraw_method_id" })
  public withdrawMethodId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @BelongsTo(() => User)
  public user!: User;

  @BelongsTo(() => WithdrawMethod)
  public withdrawMethod!: WithdrawMethod;
}
