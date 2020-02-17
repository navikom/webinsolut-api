import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "old_tokens", updatedAt: false })
class IOldTokens extends Model<IOldTokens> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "token_id" })
  public tokenId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @Column(DataType.STRING)
  public token!: string;
}

export class OldTokens extends IOldTokens {
  static async isOldToken(token: string | null): Promise<boolean> {
    if (token === null) return false;
    const data = await this.findAndCountAll({ where: { token } });
    return data.count > 0;
  }
}
