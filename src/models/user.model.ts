import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  IsEmail,
  Is,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
  HasMany,
  Sequelize,
} from 'sequelize-typescript';
import { App } from '@app/models/app.model';
import { UsersApps } from '@app/models/usersApps.model';
import { UsersRoles } from '@app/models/usersRoles.model';
import { UsersDevices } from '@app/models/usersDevices.model';
import { Event } from '@app/models/event.model';
import { ErrorHandler } from '@app/helpers/ErrorHandler';
import { UsersRegions } from '@app/models/usersRegions.model';
import { Region } from '@app/models/region.model';
import { Device } from '@app/models/device.model';
import { Role } from '@app/models/role.model';

import EventsService from '@app/services/event.service';
import { RichRequest } from '@app/interfaces/RichRequest';

export const MALE: string = 'male';
export const FEMALE: string = 'female';

export const EMAIL_CHANNEL: number = 1;
export const SMS_CHANNEL: number = 2;
export const IN_APP_CHANNEL: number = 3;
export const PUSH_CHANNEL: number = 4;

const ChannelKeys: { [key: string]: string } = {
  EMAIL_CHANNEL: 'notificationEmail',
  SMS_CHANNEL: 'notificationSms'
};

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class IUser extends Model<IUser> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.NUMBER, field: 'user_id' })
  public userId!: number;

  @IsEmail
  @Column(DataType.STRING)
  public email!: string;

  @Column(DataType.STRING)
  public password!: string;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ field: 'created_at' })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  public deletedAt!: Date;

  @Default(Date.now())
  @Column({ type: DataType.DATE, field: 'last_session' })
  public lastSession!: number;

  @Column({ type: DataType.STRING, field: 'first_name' })
  public firstName!: string;

  @Column({ type: DataType.STRING, field: 'last_name' })
  public lastName!: string;

  @Is(['^[0-9]+$', 'i'])
  @Column(DataType.NUMBER)
  public phone!: number;

  @Column(DataType.DATE)
  public birthday!: Date;

  @Column({ type: DataType.BOOLEAN, field: 'email_verified' })
  public emailVerified!: boolean;

  @Column({ type: DataType.BOOLEAN, field: 'phone_verified' })
  public phoneVerified!: boolean;

  @Column(DataType.ENUM(MALE, FEMALE))
  public gender!: 'male' | 'female';

  @Column({ type: DataType.BOOLEAN, field: 'notification_email' })
  public notificationEmail!: boolean;

  @Column({ type: DataType.BOOLEAN, field: 'notification_sms' })
  public notificationSms!: boolean;

  @Column(DataType.BOOLEAN)
  public subscription!: boolean;

  @Column(DataType.NUMBER)
  public referrer!: number;

  @Column({ type: DataType.STRING, field: 'reset_password_token' })
  public resetPasswordToken!: string;

  @HasMany(() => UsersRoles)
  public roles!: UsersRoles[];

  @HasMany(() => UsersApps)
  public apps!: UsersApps[];

  @HasMany(() => UsersDevices)
  public devices!: UsersDevices[];

  @HasMany(() => UsersRegions)
  public regions!: UsersRegions[];

  @HasMany(() => Event)
  public events!: Event[];

}

const checkSubscriptions = async (body: IUser, user: User, req: RichRequest) => {
  if (body.notificationEmail !== undefined) {
    if (body.notificationEmail !== user.notificationEmail) {
      EventsService.notificationEmailStatusChanged(user.userId, req);
    }
  }
  if (body.notificationSms !== undefined) {
    if (body.notificationSms !== user.notificationSms) {
      EventsService.notificationSmsStatusChanged(user.userId, req);
    }
  }
};

export class User extends IUser {
  static list(): Promise<[User]> {
    return this.findAll({
      attributes: { exclude: ['password', 'refreshToken', 'resetPasswordToken'] }
    });
  }

  static paginationlist(offset: number, limit: number): Promise<[User]> {
    return this.findAll({
      offset, limit,
      attributes: {
        exclude: ['password', 'refreshToken', 'resetPasswordToken'],
        include: [[Sequelize.literal('(Select COUNT(*) FROM events e WHERE e.user_id = "IUser"."user_id")'), 'eventsCount']]
      },
      include: [{
        model: UsersRoles,
        attributes: { exclude: ['roleId', 'userId'] },
        include: [{
          model: Role
        }]
      }]
    });
  }

  static paginationReferralsList(referrer: string, page: number, pageSize: number) {
    const offset = page * pageSize;
    const limit = offset + pageSize;
    const query = {
      offset, limit,
      where: { referrer },
      attributes: {
        exclude: ['password', 'refreshToken', 'resetPasswordToken'],
      }
    };
    return this.findAndCountAll(query);
  }

  static findByEmail(email: string) {
    const query: any = {
      paranoid: false,
      where: { email },
      attributes: { exclude: ['refreshToken', 'resetPasswordToken'] },
      include: [{
        model: UsersRoles,
        attributes: { exclude: ['roleId', 'userId'] },
        include: [{
          model: Role
        }]
      }, {
        model: UsersApps,
        attributes: { exclude: ['refreshToken'] },
        include: [{
          model: App,
          attributes: ['title']
        }]
      }]
    };

    return this.findOne(query);
  }

  static findByEmailParanoid(email: string): Promise<User> {
    return this.findOne({ where: { email }, paranoid: false });
  }

  static findById(userId: number): Promise<User> {
    const query: any = {
      where: { userId },
      attributes: {
        exclude: ['password', 'refreshToken'],
        include: [[Sequelize.literal('(Select COUNT(*) FROM events e WHERE e.user_id = "IUser"."user_id")'), 'eventsCount']]
      },
      include: [{
        model: UsersRoles,
        attributes: { exclude: ['roleId', 'userId'] },
        include: [{
          model: Role
        }]
      }, {
        model: UsersApps,
        attributes: { exclude: ['refreshToken'] },
        include: [{
          model: App,
          attributes: ['title']
        }]
      }]
    };

    return this.findOne(query);
  }

  static findFullDataById(userId: number): Promise<User> {
    const query: any = {
      where: { userId },
      attributes: {
        exclude: ['password', 'refreshToken'],
        include: [
          [Sequelize.literal('(Select COUNT(*) FROM events e WHERE e.user_id = "IUser"."user_id")'), 'eventsCount'],
          [Sequelize.literal('(SELECT created_at FROM events e WHERE e.user_id = "IUser"."user_id" ORDER BY e.created_at DESC LIMIT 1)'), 'lastEvent'],
          [Sequelize.literal('(SELECT anonymous FROM sessions ses WHERE ses.user_id = "IUser"."user_id" ORDER BY ses.session_id DESC LIMIT 1)'), 'anonymous']
        ]
      },
      include: [{
        model: UsersRoles,
        attributes: { exclude: ['roleId', 'userId'] },
        include: [{
          model: Role
        }]
      }, {
        model: UsersRegions,
        attributes: {
          exclude: ['userId']
        },
        include: [{
          model: Region,
          attributes: { exclude: ['regionId', 'createdAt', 'updatedAt', 'deletedAt'] },
        }]
      }, {
        model: UsersApps,
        attributes: { exclude: ['refreshToken'] },
        include: [{
          model: App,
          attributes: ['title']
        }]
      }, {
        model: UsersDevices,
        attributes: { exclude: ['userId'] },
        include: [{
          model: Device,
          attributes: { exclude: ['deviceId', 'createdAt', 'updatedAt', 'deletedAt'] },
        }]
      }]
    };

    return this.findOne(query);
  }

  static findByIdWithTokens(userId: number): Promise<User> {
    const query: any = {
      where: { userId }, attributes: { exclude: ['password'] },
      include: [{
        model: UsersApps,
        include: [{
          model: App,
          attributes: ['title']
        }]
      }]
    };

    return this.findOne(query);
  }

  static findByResetToken(resetPasswordToken: string) {
    const query: any = {
      where: { resetPasswordToken }, attributes: ['userId'],
    };
    return this.findOne(query);
  }

  static async createOne(object: { email?: string, password?: string, lastSession?: Date }) {
    const user = await this.create(object);
    return this.findById(user.userId);
  }

  static async signup(user: User, object: { email: string, password: string }) {
    await user.update(object);
  }

  static setPassword(user: User, password: string) {
    return user.update({ password });
  }

  static setEmailVerified(user: IUser) {
    return user.update({ emailVerified: true });
  }

  static setResetPasswordToken(user: User, resetPasswordToken: string) {
    return user.update({ resetPasswordToken });
  }

  static async refreshToken(user: User, refreshToken: string) {
    this.update({ refreshToken }, { where: { userId: user.userId } });
    return this.findById(user.userId);
  }

  static async updateOne(id: number, req: RichRequest) {
    const user = await User.findById(id);
    if (!user) throw new ErrorHandler('instance-not-exists');
    checkSubscriptions(req.body, user, req);
    await user.update(req.body);
    return User.findById(user.userId);
  }

  static async delete(user: User): Promise<number> {
    return this.destroy({ where: { userId: user.userId } });
  }

  static currentApp(user: User, appTitle: string) {
    return user.apps.find((a: UsersApps) => a.app.title === appTitle);
  }

  static async updateRole(userId: string, roleId: string) {
    let query = {
      where: { userId, roleId }
    };
    const count = await UsersRoles.count(query);
    if (count > 0) {
      await UsersRoles.destroy(query);
    } else {
      await UsersRoles.create(query.where);
    }

    return UsersRoles.findAll({
      where: { userId },
      attributes: { exclude: ['roleId', 'userId'] },
      include: [{
        model: Role
      }]
    });
  }

  static async updateSubscription(userId: string, channel: string, action: string) {
    const body = {
      [ChannelKeys[channel]]: action === '1'
    };
    this.updateOne(Number(userId), { body } as RichRequest);
  }

}


