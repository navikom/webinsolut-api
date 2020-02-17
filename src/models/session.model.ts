import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { Promise as SPromise } from "sequelize"
import { DestroyOptions } from "sequelize/types/lib/model";
import CONFIG from "@app/config/config";

@Table({ tableName: "sessions", timestamps: true, paranoid: true })
class ISession extends Model<ISession> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.STRING)
  public sid!: number;

  @Column({ type: DataType.NUMBER, field: "user_id" })
  public userId!: number;

  @Column({ type: DataType.NUMBER, field: "device_id" })
  public deviceId!: number;

  @Column(DataType.DATE)
  public expires!: Date;

  @Column(DataType.JSONB)
  public data!: any;

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

  public static destroy<T extends Model<T>>(this: (new () => T), options?: DestroyOptions): SPromise<number> {
    return super.destroy.call(this, options);
  }

}

class Sessions extends ISession {
  static async findById(sessionId: number) {
    const item = await this.findOne({
      where: { sessionId },
      paranoid: false
    });
    return item;
  }

  static findByUserId(userId: number) {
    return this.findAll({
      where: { userId },
      paranoid: false
    });
  }

  static async updateUser(session: any) {
    console.log(12121212, await Sessions.findByPk(session.id));
    return Sessions.update(
      {
        userId: session.user.userId,
        expires: new Date(Date.now() + parseInt(CONFIG.jwt_expiration) * 1000)
      }, { where: { sid: session.id } });
  }

  static findActiveByUserId(userId: number) {
    return this.findOne({
      where: { userId, anonymous: false },
      order: [["sessionId", "DESC"]]
    });
  }
}

export default Sessions;
