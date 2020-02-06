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

@Table({tableName: 'withdraw_methods', timestamps: true, paranoid: true})
export class WithdrawMethod extends Model<WithdrawMethod> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'withdraw_method_id'})
  public withdrawMethodId!: number;

  @Column(DataType.STRING)
  public title!: string;

  @Column(DataType.STRING)
  public description!: string;

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
