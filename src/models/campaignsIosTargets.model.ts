import {Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {Campaign} from '@app/models/campaign.model';
import {IosTarget} from '@app/models/iosTarget.model';

@Table({tableName: 'campaigns_ios_targets', updatedAt: false})
export class CampaignsIosTargets extends Model<CampaignsIosTargets> {

  @ForeignKey(() => Campaign)
  @PrimaryKey
  @Column({field: 'campaign_id'})
  public campaignId!: number;

  @ForeignKey(() => IosTarget)
  @PrimaryKey
  @Column({field: 'ios_target_id'})
  public iosTargetId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({field: 'created_at'})
  public createdAt!: Date;

}
