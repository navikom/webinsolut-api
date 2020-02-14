import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import {User} from '@app/models/user.model';
import {UsersDevices} from '@app/models/usersDevices.model';

@Table({tableName: 'devices', timestamps: true, paranoid: true})
class IDevice extends Model<IDevice> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'device_id'})
  public deviceId!: number;

  @Column(DataType.JSONB)
  public info!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({field: 'created_at'})
  public createdAt!: Date;

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt!: Date;

  @DeletedAt
  @Column({field: 'deleted_at'})
  public deletedAt!: Date;

  @BelongsToMany(() => User, () => UsersDevices)
  public users!: Array<User & { UsersDevices: UsersDevices }>;
}

// SELECT * from devices where info->'OS'->>'name' = 'unknown';
export class Device extends IDevice {
  static async findOrCreateOne(info: any): Promise<Device> {
    const data = await this.findOrCreate({
      where: {'info.headers': info.headers},
      defaults: {info}
    });
    return data[0];
  }
}
