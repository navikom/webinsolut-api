import {Sequelize} from 'sequelize-typescript';
import CONFIG from '@app/config/config';
import Auth from '@app/models/auth';
import {User} from '@app/models/user.model';
import {UsersApps} from '@app/models/usersApps.model';
import {App} from '@app/models/app.model';
import {Role} from '@app/models/role.model';
import {UsersRoles} from '@app/models/usersRoles.model';
import {ACategory} from '@app/models/aCategory.model';
import {Logs} from '@app/models/request.model';
import {Event} from '@app/models/event.model';
import {AppsImages} from '@app/models/appsImages.model';
import {Device} from '@app/models/device.model';
import {Card} from '@app/models/card.model';
import {Image} from '@app/models/image.model';
import {Payment} from '@app/models/payment.model';
import {UsersDevices} from '@app/models/usersDevices.model';
import {UsersWithdrawMethods} from '@app/models/usersWithdrawMethods.model';
import {WithdrawMethod} from '@app/models/withdrawMethod.model';
import {PixartCategory} from '@app/models/pixart/category.model';
import {PixartPicture} from '@app/models/pixart/picture.model';
import {Crash} from '@app/models/crash.model';
import {Region} from '@app/models/region.model';
import {UsersRegions} from '@app/models/usersRegions.model';
import {PixartUsersPictures} from '@app/models/pixart/usersPictures.model';
import {Campaign} from '@app/models/campaign.model';
import {Segment} from '@app/models/segment.model';
import {AndroidTarget} from '@app/models/androidTarget.model';
import {CampaignsAndroidTargets} from '@app/models/campaignsAndroidTargets.model';
import {CampaignsIosTargets} from '@app/models/campaignsIosTargets.model';
import {CampaignsSegments} from '@app/models/campaignsSegments.model';
import {IosTarget} from '@app/models/iosTarget.model';
import {Variant} from '@app/models/variant.model';
import {Session} from '@app/models/session.model';

console.log('CONFIG', CONFIG);
const timezone = 'UTC';
const sequelize = new Sequelize(
  `postgresql://${CONFIG.db_user}:${CONFIG.db_password}@${CONFIG.db_host}/${CONFIG.db_name}`,
  {
    dialect: 'postgres',
    dialectOptions: {
      timezone,
    },
    logging: false,
    timezone,
    models: [User, Session, UsersApps, App, Role, UsersRoles, ACategory, Logs, Event, AppsImages, Card, Device,
      Image, Payment, UsersDevices, UsersWithdrawMethods, WithdrawMethod, PixartCategory, PixartPicture, Crash, Region,
      UsersRegions, PixartUsersPictures, Campaign, Segment, AndroidTarget, CampaignsAndroidTargets,
    CampaignsIosTargets, CampaignsSegments, IosTarget, Variant]
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

const db = sequelize;
export {
  db,
  Auth,
}

