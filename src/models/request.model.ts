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
} from 'sequelize-typescript';

@Table({tableName: 'requests', updatedAt: false})
export class Logs extends Model<Logs> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'request_id'})
  public requestId!: number;

  @Column(DataType.STRING)
  public token!: string;

  @Column(DataType.STRING)
  public url!: string;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({field: 'created_at'})
  public createdAt!: Date;

  @Column(DataType.STRING)
  public method!: string;

  @Column(DataType.STRING)
  public app!: string;
}
