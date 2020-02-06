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

@Table({tableName: 'pixart_categories', timestamps: true, paranoid: true})
export class PixartCategory extends Model<PixartCategory> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'category_id'})
  public categoryId!: number;

  @Column(DataType.STRING)
  public name!: string;

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
