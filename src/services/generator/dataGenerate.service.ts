import fetch, { Response } from 'node-fetch';
import { asyncTimeout, getRandomDate, randomId, randomInt, randomItem, randomString } from '@app/utils/utils';
import { DeviceType } from '@app/models/types/models';
import { User } from '@app/models/user.model';
import { Session } from '@app/models/session.model';
import { Sequelize } from 'sequelize-typescript';
import { db } from '@app/models';
import { ErrorHandler } from '@app/helpers/ErrorHandler';
import { Device } from '@app/models/device.model';
import { getCookies } from '@app/helpers/HTTPRequest';
import { RichRequest } from '@app/interfaces/RichRequest';

type LocaleType = {
  language: string;
  code: string;
  country: string;
  timezone: string;
}

const names = ['Leena', 'Ayana', 'Jena', 'Maryalice', 'Jodee', 'Gerda', 'Karlyn', 'Aletha', 'Yuko', 'Lenore', 'Monica', 'Arminda', 'So', 'Maire', 'Omega', 'Alethia', 'Monnie', 'Natosha', 'Marcie', 'Jaimie', 'Giselle', 'Veta', 'Hiedi', 'Marni', 'Masako', 'Zora', 'Vinita', 'Inge', 'Angelique', 'Casie', 'Hyun', 'Jonna', 'Marsha', 'Ranee', 'Dorie', 'Kenyetta', 'Lizzette', 'Shanda', 'Celine', 'Stefanie', 'Phylicia', 'Brittni', 'Pearle', 'Waneta', 'Avis', 'Agueda', 'Jacinda', 'Lillian', 'Pauletta', 'Katy', 'Lee', 'Brice', 'Bryon', 'Alonso', 'Boyce', 'Kurt', 'Floyd', 'Keven', 'Trevor', 'Vernon', 'King', 'Oswaldo', 'Tristan', 'Mark', 'Sammy', 'Fernando', 'Otha', 'Randal', 'Huey', 'Guadalupe', 'Sung', 'Elbert', 'Leif', 'Jon', 'Roland', 'Omar', 'Jamaal', 'Rudy', 'Rueben', 'Julius', 'Danilo', 'Dexter', 'Giuseppe', 'Garfield', 'Lowell', 'Jonah', 'Moises', 'Patricia', 'Michale', 'Cletus', 'Bobbie', 'Tobias', 'Anthony', 'Lindsey', 'Benito', 'Darrell', 'Renaldo', 'Omer', 'Ty', 'Rayford'];

const locales: LocaleType[] = [
  { language: 'en', code: 'en-US', country: 'US', timezone: 'America/New_York' },
  { language: 'en', code: 'en-US', country: 'US', timezone: 'America/Los_Angeles' },
  { language: 'en', code: 'en-US', country: 'US', timezone: 'America/Chicago' },
  { language: 'en', code: 'en-GB', country: 'GB', timezone: 'Europe/London' },
  { language: 'en', code: 'en-US', country: 'CA', timezone: 'America/Toronto' },
  { language: 'fr', code: 'fr-CA', country: 'CA', timezone: 'America/Toronto' },
  { language: 'fr', code: 'fr-FR', country: 'FR', timezone: 'Europe/Paris' },
];

const devices: DeviceType[] = [
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': 23,
    'manufacturer': 'HUAWEI',
    'brand': 'Huawei',
    'model': 'ALE-L21',
    'device': 'hwALE-H'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(26, 28),
    'manufacturer': 'HUAWEI',
    'brand': 'Huawei',
    'model': 'P10',
    'device': 'P10'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'GOOGLE',
    'brand': 'Google',
    'model': 'Pixel/XL',
    'device': 'Pixel/XL'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'GOOGLE',
    'brand': 'Google',
    'model': 'Pixel 2/XL',
    'device': 'Pixel 2/XL'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'GOOGLE',
    'brand': 'Google',
    'model': 'Pixel 3a/XL',
    'device': 'Pixel 3a/XL'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'HTC',
    'brand': 'HTC',
    'model': 'Dream',
    'device': 'Dream'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'HTC',
    'brand': 'HTC',
    'model': 'Hero',
    'device': 'Hero'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'Samsung Electronics',
    'brand': 'Samsung',
    'model': 'Galaxy S7/Edge',
    'device': 'Galaxy S7/Edge'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'Samsung Electronics',
    'brand': 'Samsung',
    'model': 'Galaxy S8/+',
    'device': 'Galaxy S8/+'
  },
  {
    'androidId': randomId(),
    'release': 6.0,
    'sdk': randomInt(25, 28),
    'manufacturer': 'Samsung Electronics',
    'brand': 'Samsung',
    'model': 'Galaxy Note 8',
    'device': 'Galaxy Note 8'
  },
  // IOS
  {
    'name': 'My iPhone',
    'systemName': 'iPhone3,3',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPhone 4',
    'localizedModel': 'iPhone 4',
    'vendorId': randomId(),
    'release': new Date('September 9, 2014'),
  },
  {
    'name': 'My iPhone',
    'systemName': 'iPhone6,2',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPhone 5s',
    'localizedModel': 'iPhone 5s',
    'vendorId': randomId(),
    'release': new Date('2016-03-21'),
  },
  {
    'name': 'My iPhone',
    'systemName': 'iPhone8,1',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPhone 6s',
    'localizedModel': 'iPhone 6s',
    'vendorId': randomId(),
    'release': new Date('2018-09-12'),
  },
  {
    'name': 'My iPhone',
    'systemName': 'iPhone10,6',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPhone X',
    'localizedModel': 'iPhone X',
    'vendorId': randomId(),
    'release': new Date('2018-09-12'),
  },
  {
    'name': 'My iPhone',
    'systemName': 'iPhone11,8',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPhone XR',
    'localizedModel': 'iPhone XR',
    'vendorId': randomId(),
    'release': new Date('2019-09-10'),
  },
  {
    'name': 'My iPad',
    'systemName': 'iPad7,2',
    'systemVersion': `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    'model': 'iPad Pro 12.9-inch 2',
    'localizedModel': 'iPad Pro 12.9-inch 2',
    'vendorId': randomId(),
    'release': new Date('2018-03-27'),
  }
];

const anonymousSession: ScenarioType = {
  method: 'anonymous',
};

const signUp: ScenarioType = {
  method: 'signUp',
};

const userData: ScenarioType = {
  method: 'userData',
};

const login: ScenarioType = {
  method: 'login',
};

const logout: ScenarioType = {
  method: 'logout',
};

const event: ScenarioType = {
  method: 'event',
};

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Cookie': 'APP=Pixart',
  'user-agent': ''
};

type ScenarioType = {
  method: keyof IDataGenerateService;
}

interface IDataGenerateService {
  anonymous(): void;

  signUp(): void;

  userData(): void;

  login(): void;

  logout(): void;

  event(): void;
}

export class DataGenerateService implements IDataGenerateService {
  static APP = 'Pixart';
  static url: string = 'http://localhost:3001/v1/';
  static cache = new Map<number, { [key: string]: string }>();

  constructor(scenario: ScenarioType[]) {
    this.runMethods(scenario);
  }

  headers(headers: { [key: string]: string | number } = {}, userId?: number) {
    const params = {
      app: DataGenerateService.APP,
      device: randomItem(devices),
      locale: randomItem(locales)
    };
    const language = userId && DataGenerateService.cache.has(userId) ?
      DataGenerateService.cache.get(userId)!.language :
      `${params.locale!.language},${params.locale!.code},${params.locale!.country};q=0.6`;
    const timezone = userId && DataGenerateService.cache.has(userId) ?
      DataGenerateService.cache.get(userId)!.timezone : params.locale!.timezone;
    const userAgent = userId && DataGenerateService.cache.has(userId) ?
      DataGenerateService.cache.get(userId)!.userAgent : JSON.stringify(params.device);
    const cookie = userId && DataGenerateService.cache.has(userId) ?
      `APP=${params.app};SESSION=${DataGenerateService.cache.get(userId)!.session}` : `APP=${params.app}`;
    return {
      ...defaultHeaders,
      Cookie: cookie,
      'user-agent': userAgent,
      'Accept-Language': language,
      'Accept-Timezone': timezone,
      ...headers
    }
  }

  async headersByUser(userId: number) {
    const session = await Session.findActiveByUserId(userId);
    if (!session) throw new ErrorHandler('There is no active session');
    const device = await Device.findOne({ where: { deviceId: session.deviceId } });
    if (!device) throw new ErrorHandler(`There is no device by deviceId ${session.deviceId}`);
    const params = {
      app: DataGenerateService.APP
    };
    const cookie = `APP=${params.app};SESSION=${session.sessionId}`;
    console.log('Headers user %d session %d', userId, session.sessionId);
    return this.headers({
      Cookie: cookie,
      'user-agent': JSON.stringify(device.info),
    }, userId);
  }

  async headersForAnonymous(userId: number) {
    const user = await User.findFullDataById(userId);
    if (user.devices.length === 0) throw new ErrorHandler(`There are no devices for user ${userId}`);
    const userAgent = randomItem(user.devices).device.info;
    return this.headers({
      'user-agent': JSON.stringify(userAgent),
    });
  }

  async runMethods(scenario: ScenarioType[]) {
    let l = scenario.length, i = 0;
    while (l--) {
      const item = scenario[i++];
      console.log('Method start %s', item.method);
      await this[item.method]();
      await asyncTimeout(1000);
      console.log('Method end %s', item.method);
      console.log('================================');
    }
  }

  async anonymous() {
    try {
      const headers = this.headers();
      const response = await fetch(DataGenerateService.url + 'users/anonymous', { method: 'POST', headers });
      const json = await response.json();
      DataGenerateService.cache.set(json.data.user.userId, {
        userAgent: headers['user-agent'],
        language: headers['Accept-Language'],
        timezone: headers['Accept-Timezone'],
        session: json.data.session
      });
      console.log('Create anonymous user %d session %d', json.data.user.userId, json.data.session);
    } catch (e) {
      console.log('Create Anonymous Error %s', e.message);
    }

  }

  async signUp() {
    try {
      let user = await User.findOne({
        where: { email: null },
        order: Sequelize.literal('user_id DESC')
      });
      if (!user) throw new ErrorHandler('There are no users without email');
      user = await User.findFullDataById(user.userId);
      const sessions = await Session.findByUserId(user.userId);
      if (!sessions || !sessions.length) return;
      const headers = this.headers({}, user.userId);

      const body = JSON.stringify({
        email: `user_${user.userId}@email.net`,
        password: '123456',
      });

      const response = await fetch(DataGenerateService.url + 'users/sign-up', { method: 'POST', headers, body });
      const json = await response.json();
      this.fillCache(json.data.user, headers, `User login %d header session %d response session ${json.data.session}`);
    } catch (e) {
      console.log('Sign Up Error %s', e.message);
    }

  }

  async userData() {
    const result = await db.query(
      `select user_id, 
        (Select COUNT(*) FROM users u WHERE u.first_name is null and u.last_name is null and u.email is not null) AS cnt from users
        WHERE first_name is null and last_name is null and email is not null
        ORDER BY random() LIMIT ${randomInt(2, 10)}`
    );
    let length = result[0].length;
    while (length--) {
      const data = result[0][length] as { user_id: number };
      const userId = data.user_id;
      try {
        const headers = await this.headersByUser(userId);
        const firstName = randomItem(names);
        const body = JSON.stringify({
          firstName,
          lastName: randomString(randomInt(5, 10)),
          birthday: getRandomDate(),
          gender: names.indexOf(firstName) < 50 ? 'female' : 'male',
          notificationEmail: Math.random() >= 0.5,
          notificationSms: Math.random() >= 0.5,
          subscription: Math.random() >= 0.5,
        });
        const response = await fetch(`${DataGenerateService.url}users/${userId}`, { method: 'PUT', headers, body });
        const json = await response.json();
        this.fillCache(json.data, headers, 'User updated %d session %d');
      } catch (e) {
        console.log('Users Update Data Error %s', e.message);
      }

    }
  }

  async login() {
    const result = await db.query(
      `select ses.user_id as userId, email from sessions ses
        RIGHT JOIN users us on us.user_id = ses.user_id
        WHERE anonymous='true'
        ORDER BY random() LIMIT ${randomInt(2, 10)}`
    );
    let length = result[0].length;
    while (length--) {
      const { userid, email } = result[0][length] as { userid: number, email: string };
      try {
        const headers = await this.headersForAnonymous(userid);
        const body = JSON.stringify({ email, password: '123456', grantType: 'password' });
        const response = await fetch(`${DataGenerateService.url}users/login`, { method: 'POST', headers, body });
        const json = await response.json();
        this.fillCache(json.data.user, headers, `User login %d header session %d response session ${json.data.session}`);
      } catch (e) {
        console.log('User Login Error %s', e.message);
      }
    }
  }

  async logout() {
    const result = await db.query(
      `select ses.user_id as userId from sessions ses
        RIGHT JOIN users us on us.user_id = ses.user_id
        WHERE anonymous='false'
        ORDER BY random() LIMIT ${randomInt(2, 10)}`
    );
    let length = result[0].length;
    while (length--) {
      const { userid } = result[0][length] as { userid: number };
      try {
        const headers = await this.headersByUser(userid);
        const response = await fetch(`${DataGenerateService.url}users/logout`, { method: 'GET', headers });
        console.log('User %d logout', userid, response.status);
      } catch (e) {
        console.log('User Logout Error %s', e.message);
      }
    }
  }

  async event() {

  }

  async fillCache(user: User, headers: { [key: string]: string }, logMessage: string) {
    const object = DataGenerateService.cache.has(user.userId) ? DataGenerateService.cache.get(user.userId) : {};
    const cookie = getCookies({ headers } as RichRequest);
    DataGenerateService.cache.set(user.userId, {
      ...object,
      session: cookie.SESSION
    });
    console.log(logMessage, user.userId, cookie.SESSION);
  }

  static runService() {
    new DataGenerateService([anonymousSession, signUp, userData, logout, login]);
  }

}
