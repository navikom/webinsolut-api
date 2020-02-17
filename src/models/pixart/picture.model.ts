import {
  AutoIncrement, BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default, DeletedAt, ForeignKey, HasMany,
  Model,
  PrimaryKey, Sequelize,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { imageSize } from "image-size";
import { UploadApiOptions } from "cloudinary";
import { PixartCategory } from "@app/models/pixart/category.model";
import { CloudinaryService } from "@app/services/cloudinary.service";
import { PIXART } from "@app/config/constants";
import { PixartUsersPictures } from "@app/models/pixart/usersPictures.model";

const MAX_LENGTH = 30000;
const MAX_SIZE = 150;

@Table({ tableName: "pixart_pictures", timestamps: true, paranoid: true })
class IPixartPicture extends Model<PixartPicture> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: "picture_id" })
  public pictureId!: number;

  @Column(DataType.STRING)
  public path!: string;

  @Column(DataType.STRING)
  public name!: string;

  @Column({ type: DataType.STRING, field: "image_type" })
  public imageType!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  public approved!: boolean;

  @ForeignKey(() => PixartCategory)
  @Column({ type: DataType.NUMBER, field: "category_id" })
  public categoryId!: number;

  @BelongsTo(() => PixartCategory)
  category!: PixartCategory;

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

  @HasMany(() => PixartUsersPictures)
  public users!: PixartUsersPictures[];
}

export class PixartPicture extends IPixartPicture {
  static async findById(pictureId: string) {
    const res = await this.findOne({
      where: { pictureId },
    });
    return res;
  }

  static async savePictures(files: any, categoryId: number) {
    let l = files.length, i = 0;
    const pictures: PixartPicture[] = [];
    while (l--) {
      const file = files[i++];
      const size = imageSize(file.buffer);
      const w = size.width || 1;
      const h = size.height || 1;
      const picture = await this.create({ categoryId, imageType: size.type, path: "" });
      const options: UploadApiOptions = {};
      if (file.size > MAX_LENGTH) {
        const diff = Math.min(MAX_SIZE / w, MAX_SIZE / h);
        options.width = Math.round(w * diff);
        options.height = Math.round(h * diff);
        options.crop = "limit";
      }
      await CloudinaryService.upload(file, picture.pictureId.toString(), PIXART, options);
      pictures.push(picture);
    }
    return pictures;
  }

  static async findAllWithPagination(data: { limit: number, offset: number }) {
    const { limit, offset } = data;
    const query = {
      limit, offset,
      attributes: {
        include: [
          [Sequelize.literal("(Select COUNT(*) FROM pixart_users_pictures e WHERE e.picture_id = picture_id)"), "usersCount"],
          [Sequelize.literal("(SELECT updated_at FROM pixart_users_pictures e WHERE e.picture_id = picture_id ORDER BY e.updated_at DESC LIMIT 1)"), "lastEvent"]
        ]
      }
    };
    // @ts-ignore
    return this.findAndCountAll(query);
  }
}
