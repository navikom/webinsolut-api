import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType, Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import {App} from '@app/models/app.model';

@Table({tableName: 'a_categories', timestamps: true, paranoid: true})
export class ACategory extends Model<ACategory> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'a_category_id'})
  public categoryId!: number;

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

  @Column(DataType.STRING)
  public name!: string;

  @HasMany(() => App)
  public apps!: App[];

}
