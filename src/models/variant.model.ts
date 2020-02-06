import {
  AutoIncrement, BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default, ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import {Campaign} from '@app/models/campaign.model';

@Table({tableName: 'variants', timestamps: true})
class IVariant extends Model<IVariant> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'variant_id'})
  public variantId!: number;

  @ForeignKey(() => Campaign)
  @Column({type: DataType.NUMBER, field: 'campaign_id'})
  public campaignId!: number;

  @Column(DataType.JSONB)
  public data!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({field: 'created_at'})
  public createdAt!: Date;

  @UpdatedAt
  @Column({field: 'updated_at'})
  public updatedAt!: Date;

  @BelongsTo(() => Campaign)
  campaign!: Campaign;

}

export class Variant extends IVariant {

}
