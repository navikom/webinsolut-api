import {
  AutoIncrement, BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey, Sequelize,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { RichRequest } from "@app/interfaces/RichRequest";
import { CampaignsSegments } from "@app/models/campaignsSegments.model";
import { Segment } from "@app/models/segment.model";
import { AndroidTarget } from "@app/models/androidTarget.model";
import { IosTarget } from "@app/models/iosTarget.model";
import { Variant } from "@app/models/variant.model";
import { CampaignsAndroidTargets } from "@app/models/campaignsAndroidTargets.model";
import { CampaignsIosTargets } from "@app/models/campaignsIosTargets.model";

@Table({ tableName: "campaigns", timestamps: true, paranoid: true })
class ICampaign extends Model<ICampaign> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "campaign_id" })
  public campaignId!: number;

  @Column(DataType.STRING)
  public name!: string;

  @Column({ type: DataType.NUMBER, field: "run_type" })
  public runType!: number;

  @Column({ type: DataType.NUMBER, field: "channel_type" })
  public channelType!: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: "only_for_subscribed" })
  public onlyForSubscribed!: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: "frequency_cap" })
  public frequencyCap!: boolean;

  @Column({ field: "start_date" })
  public startDate!: Date;

  @Column({ field: "end_date" })
  public endDate!: Date;

  @Column(DataType.JSONB)
  public conversion!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  public updatedAt!: Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  public deletedAt!: Date;

  @HasMany(() => CampaignsSegments)
  public segments!: CampaignsSegments[];

  @BelongsToMany(() => AndroidTarget, () => CampaignsAndroidTargets)
  public androidTargets!: AndroidTarget[];

  @BelongsToMany(() => IosTarget, () => CampaignsIosTargets)
  public iosTargets!: IosTarget[];

  @HasMany(() => Variant)
  public variants!: Variant[];

}

export class Campaign extends ICampaign {
  static async paginationlist(req: RichRequest) {
    const page = parseInt(req.params.page);
    const pageSize = parseInt(req.params.pageSize);
    const channelType = req.params.channel;
    const offset = page * pageSize;
    const limit = offset + pageSize;
    const query = {
      offset, limit,
      where: { channelType },
      include: [{
        model: CampaignsSegments,
        attributes: { exclude: ["campaignId", "segmentId"] },
        include: [{
          model: Segment
        }]
      }, {
        model: AndroidTarget
      }, {
        model: IosTarget
      }, {
        model: Variant,
      }],
      order: Sequelize.literal("campaign_id DESC")
    };
    const data = await this.findAndCountAll(query);
    return { count: data.count, items: data.rows, page, pageSize };
  }
}
