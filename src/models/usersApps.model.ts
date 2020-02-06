import {
  Column,
  ForeignKey,
  Table,
  Model,
  DataType,
  CreatedAt,
  Default,
  UpdatedAt,
  DeletedAt, BelongsTo, PrimaryKey
} from 'sequelize-typescript';
import {App} from '@app/models/app.model';
import {User} from '@app/models/user.model';
import {Device} from '@app/models/device.model';
import EventsService from '@app/services/event.service';
import {RichRequest} from '@app/interfaces/RichRequest';

@Table({tableName: 'users_apps'})
class IUsersApps extends Model<IUsersApps> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column({field: 'user_id'})
  userId!: number;

  @ForeignKey(() => App)
  @PrimaryKey
  @Column({field: 'app_id'})
  appId!: number;

  @BelongsTo(() => App)
  app!: App;

  @BelongsTo(() => User)
  user!: User;

  @Column({type: DataType.DATE, field: 'subscr_expires'})
  subscrExpires!: Date;

  @Column({type: DataType.BOOLEAN, field: 'notification_email'})
  public notificationEmail!: boolean;

  @Column({type: DataType.BOOLEAN, field: 'notification_sms'})
  public notificationSms!: boolean;

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

export class UsersApps extends IUsersApps{

  static async addLinkIfNotExists(user: User, req: RichRequest): Promise<App | null> {
    if (!req.iapp) return null;
    const app = await App.findOrCreateOne(req.iapp.title);
    if (user.apps.some((a: UsersApps) => a.appId === app.appId)) {
      return app;
    }
    EventsService.appDownload(user.userId, req);
    await UsersApps.create({appId: app.appId, userId: user.userId});
    return app;
  }

}
