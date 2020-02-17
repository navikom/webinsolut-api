import { Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Campaign } from "@app/models/campaign.model";
import { AndroidTarget } from "@app/models/androidTarget.model";

@Table({ tableName: "campaigns_android_targets", updatedAt: false })
export class CampaignsAndroidTargets extends Model<CampaignsAndroidTargets> {

  @ForeignKey(() => Campaign)
  @PrimaryKey
  @Column({ field: "campaign_id" })
  public campaignId!: number;

  @ForeignKey(() => AndroidTarget)
  @PrimaryKey
  @Column({ field: "android_target_id" })
  public androidTargetId!: number;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

}
