import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { Campaign } from "@app/models/campaign.model";
import { Segment } from "@app/models/segment.model";

@Table({ tableName: "campaigns_segments" })
export class CampaignsSegments extends Model<CampaignsSegments> {

  @ForeignKey(() => Campaign)
  @PrimaryKey
  @Column({ field: "campaign_id" })
  public campaignId!: number;

  @ForeignKey(() => Segment)
  @PrimaryKey
  @Column({ field: "segment_id" })
  public segmentId!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  public include!: boolean;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  public updatedAt!: Date;

  @BelongsTo(() => Campaign)
  public campaign!: Campaign;

  @BelongsTo(() => Segment)
  public segment!: Segment;
}
