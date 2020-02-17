import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model, PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "@app/models/user.model";
import { Role } from "@app/models/role.model";

@Table({ tableName: "users_roles", updatedAt: false })
export class UsersRoles extends Model<UsersRoles> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ field: "user_id" })
  public userId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @ForeignKey(() => Role)
  @PrimaryKey
  @Column({ field: "role_id" })
  public roleId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @BelongsTo(() => Role)
  public role!: Role;

}
