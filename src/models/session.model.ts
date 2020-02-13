import {
  AutoIncrement, BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt, ForeignKey,
  Model,
  PrimaryKey, Sequelize,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from '@app/models/user.model';

@Table({tableName: 'sessions', timestamps: true, paranoid: true})
class ISession extends Model<ISession> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'session_id'})
  public sessionId!: number;

  @Column({type: DataType.NUMBER, field: 'user_id'})
  public userId!: number;

  @Column({type: DataType.NUMBER, field: 'device_id'})
  public deviceId!: number;

  @Column(DataType.BOOLEAN)
  public anonymous!: boolean;

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

}

export class Session extends ISession {
  static async findById(sessionId: number) {
    const item = await this.findOne({
      where: {sessionId},
      paranoid: false
    });
    return item;
  }

  static findByUserId(userId: number) {
    return this.findAll({
      where: {userId},
      paranoid: false
    });
  }

  static findActiveByUserId(userId: number) {
    return this.findOne({
      where: {userId, anonymous: false},
      order: [['sessionId', 'DESC']]
    });
  }
}
