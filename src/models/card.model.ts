import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  IsCreditCard,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import {User} from '@app/models/user.model';

@Table({tableName: 'cards', timestamps: true, paranoid: true})
export class Card extends Model<Card> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'card_id'})
  public cardId!: number;

  @ForeignKey(() => User)
  @Column({type: DataType.NUMBER, field: 'user_id'})
  public userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @Column({type: DataType.STRING, field: 'card_holder'})
  public cardholder!: string;

  @Column(DataType.NUMBER)
  public cvv!: number;

  @IsCreditCard
  @Column(DataType.NUMBER)
  public num!: number;

  @Column(DataType.DATE)
  public expires!: Date;

  @Column(DataType.BOOLEAN)
  public current!: boolean;

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
