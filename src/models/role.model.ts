import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType, Default,
  DeletedAt, HasMany,
  Model,
  PrimaryKey,
  Table, UpdatedAt
} from "sequelize-typescript";
import { User } from "@app/models/user.model";
import { UsersRoles } from "@app/models/usersRoles.model";

export const USER_ROLE: string = "user";
export const ADMIN_ROLE: string = "admin";
export const PARTNER_ROLE: string = "partner";
export const SUPER_ADMIN_ROLE: string = "super_admin";

@Table({ tableName: "roles", timestamps: true, paranoid: true })
export class IRole extends Model<IRole> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "role_id" })
  public roleId!: number;

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

  @Column(DataType.ENUM(USER_ROLE, ADMIN_ROLE, PARTNER_ROLE, SUPER_ADMIN_ROLE))
  public name!: typeof USER_ROLE | typeof ADMIN_ROLE | typeof PARTNER_ROLE | typeof SUPER_ADMIN_ROLE;

  @HasMany(() => UsersRoles)
  users!: UsersRoles[];
}

export class Role extends IRole {

  static list() {
    return this.findAll({ paranoid: false });
  }
}
