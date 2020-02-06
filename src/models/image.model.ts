import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript';

@Table({tableName: 'images', timestamps: true, paranoid: true})
export class Image extends Model<Image> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'image_id'})
  public imageId!: number;

  @Column(DataType.STRING)
  public path!: string;

  @Column(DataType.STRING)
  public title!: string;

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
