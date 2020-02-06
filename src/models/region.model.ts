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
import {RegionType} from '@app/models/types/models';

@Table({tableName: 'regions', timestamps: true, paranoid: true})
export class IRegion extends Model<IRegion> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'region_id'})
  public regionId!: number;

  @Column(DataType.STRING)
  public country!: string;

  @Column(DataType.STRING)
  public region!: string;

  @Column(DataType.STRING)
  public timezone!: string;

  @Column(DataType.STRING)
  public city!: string;

  @Column(DataType.STRING)
  public ip!: string;

  @Column(DataType.DOUBLE)
  public lt!: number;

  @Column(DataType.DOUBLE)
  public lg!: number;

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

export class Region extends IRegion {
  static async findOrCreateOne(data: RegionType): Promise<Region | null> {
    if(!data.ip) return null;
    const result = await this.findOrCreate({
      where: {ip: data.ip},
      defaults: {...data}
    });
    return result[0];
  }
}
