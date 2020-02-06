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

@Table({tableName: 'segments', timestamps: true, paranoid: true})
class ISegment extends Model<ISegment> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'segment_id'})
  public segmentId!: number;

  @Column(DataType.STRING)
  public name!: string;

  @Column({type: DataType.JSONB, field: 'user_data'})
  public user!: any;

  @Column(DataType.JSONB)
  public behavior!: any;

  @Column(DataType.JSONB)
  public technology!: any;

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

export class Segment extends ISegment {

}
