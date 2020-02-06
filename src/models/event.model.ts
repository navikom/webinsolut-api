import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import {User} from '@app/models/user.model';
import {db} from '@app/models/index';

@Table({tableName: 'events', updatedAt: false})
export class IEvent extends Model<IEvent> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.NUMBER, field: 'event_id'})
  public eventId!: number;

  @ForeignKey(() => User)
  @Column({type: DataType.NUMBER, field: 'user_id'})
  public userId!: number;

  @BelongsTo(() => User)
  public user!: User;

  @Column(DataType.STRING)
  public title!: string;

  @Column(DataType.JSONB)
  public app!: any;

  @Column(DataType.JSONB)
  public device!: any;

  @Column(DataType.JSONB)
  public region!: any;

  @Column(DataType.JSONB)
  public info!: any;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({field: 'created_at'})
  public createdAt!: Date;
}

export class Event extends IEvent {
  static async paginationGroupUser(page: number, pageSize: number) {
    const offset = page * pageSize;
    const limit = offset + pageSize;

    const row = `SELECT * FROM 
(SELECT DISTINCT ON ("e"."user_id") "e"."user_id" AS "userId", "e"."event_id" AS "eventId", 
   "e"."created_at" AS "createdAt", "e"."info", "e"."title", 
   "user"."email" AS "user.email", "user"."created_at" AS "user.createdAt", "user"."updated_at" AS "user.updatedAt", 
   "user"."deleted_at" AS "user.deletedAt", "user"."last_session" AS "user.lastSession", 
   "user"."first_name" AS "user.firstName", "user"."last_name" AS "user.lastName", "user"."phone" AS "user.phone", 
   "user"."birthday" AS "user.birthday", "user"."email_verified" AS "user.emailVerified", 
   "user"."phone_verified" AS "user.phoneVerified", "user"."gender" AS "user.gender", 
   "user"."notification_email" AS "user.notificationEmail", "user"."notification_sms" AS "user.notificationSms", 
   (Select COUNT(*) FROM events ee WHERE ee.user_id = "user"."user_id") AS "user.eventsCount",
   "user"."subscription" AS "user.subscription", "user"."referrer" AS "user.referrer" 
   FROM "events" AS "e" 
   LEFT OUTER JOIN "users" AS "user" ON "e"."user_id" = "user"."user_id" AND ("user"."deleted_at" IS NULL) 
   ORDER BY "e"."user_id") AS "IEvents"
ORDER BY "IEvents"."eventId" DESC LIMIT ${limit} OFFSET ${offset}`;

    return db.query(row, {model: Event});
  }

  static async countBySingleUser() {
    const query = {
      attributes: [[Sequelize.literal('DISTINCT ON ("IEvent"."user_id") "IEvent"."user_id"'), 'userId'], 'eventId'],
      group: [Sequelize.literal('"IEvent"."user_id", "event_id"')],
    };
    // @ts-ignore
    return this.findAll(query);
  }

  static async paginationByUser(page: number, pageSize: number, id: string) {
    const offset = page * pageSize;
    const limit = offset + pageSize;
    const userId = parseInt(id);
    const query = {
      offset, limit,
      where: {userId},
      order: Sequelize.literal('event_id DESC')
    };

    return this.findAndCountAll(query);
  }
}
