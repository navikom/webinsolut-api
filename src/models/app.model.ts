import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";
import { User } from "@app/models/user.model";
import { UsersApps } from "@app/models/usersApps.model";
import { ACategory } from "@app/models/aCategory.model";
import { AppsImages } from "@app/models/appsImages.model";
import { Image } from "@app/models/image.model";
// import { db } from "@app/models/index";
import { CloudinaryService } from "@app/services/cloudinary.service";
import CONFIG from "@app/config/config";

@Table({ tableName: "apps", timestamps: true, paranoid: true })
class IApp extends Model<IApp> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "app_id" })
  public appId!: number;

  @Unique
  @Column(DataType.STRING)
  public title!: string;

  @Column(DataType.STRING)
  public description!: string;

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

  @ForeignKey(() => ACategory)
  @Column({ type: DataType.NUMBER, field: "a_category_id" })
  public categoryId!: number;

  @BelongsTo(() => ACategory)
  category!: ACategory;

  @BelongsToMany(() => User, () => UsersApps)
  users!: Array<User & { UsersApps: UsersApps }>;

  @HasMany(() => AppsImages)
  images!: AppsImages[];

}

class App extends IApp {

  static async createApp(body: { title: string, categoryId: number }) {
    body.categoryId === undefined && (body.categoryId = 1);
    return this.create(body);
  }

  static async findById(appId: string) {
    const res = await this.findOne({
      where: { appId },
      include: [{
        model: AppsImages
      }],
      order: Sequelize.literal("\"images\".\"sorting\" ASC")
    });
    return res;
  }

  static findByTitle(title: string): Promise<App> {
    return this.findOne({ where: { title } });
  }

  static async findOrCreateOne(title: string, categoryId: number = 1): Promise<App> {
    const data = await this.findOrCreate({
      where: { title }, defaults: { title, categoryId }
    });
    return data[0];
  }

  static async updateData(appId: string, body: any, files: any) {
    if (!!files) {
      let l = files.length, i = 0;
      while (l--) {
        const image = await Image.create({ path: "" });
        const file = files[i++];
        await CloudinaryService.upload(file, image.imageId.toString(), CONFIG.cloudinary_folder);
        await AppsImages.create({ appId, imageId: image.imageId });
      }
    }
    body && Object.keys(body).length && await this.update(body, { where: { appId } });
    return await this.findById(appId);
  }

  static async sortImages(appId: string, data: { imageId: number, sort: number }[]) {
    const sortWhen: string[] =
      data.map((e) => `when image_id = ${e.imageId} then ${e.sort}`);
    const query =
      `update apps_images set sorting =
        case
            ${sortWhen.join("\n")}
        end
       where app_id = ${appId};`;
    // db.query(query);
    return true;
  }

  static async deleteAppImage(appId: string, imageId: string) {
    CloudinaryService.delete(imageId, CONFIG.cloudinary_folder);
    AppsImages.destroy({ where: { appId, imageId } });
    return true;
  }
}

export default App
