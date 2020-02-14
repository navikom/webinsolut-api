import fetch from 'node-fetch';
import { asyncTimeout, getRandomDate, randomInt, randomItem, randomString } from '@app/utils/utils';
import { User } from '@app/models/user.model';
import { Session } from '@app/models/session.model';
import { Sequelize } from 'sequelize-typescript';
import { db } from '@app/models';
import { ErrorHandler } from '@app/helpers/ErrorHandler';
import { Device } from '@app/models/device.model';
import { getCookies } from '@app/helpers/HTTPRequest';
import { RichRequest } from '@app/interfaces/RichRequest';
import { devices, eventData, eventTitles, locales, names } from '@app/services/generator/data';

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

const adjustData: ScenarioType = {
  method: 'adjustData',
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

  adjustData(): void;
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
    if (!session) throw new ErrorHandler('There is no active session user' + userId);
    const device = await Device.findOne({ where: { deviceId: session.deviceId } });
    if (!device) throw new ErrorHandler(`There is no device by deviceId ${session.deviceId}`);
    const params = {
      app: DataGenerateService.APP
    };
    const cookie = `APP=${params.app};SESSION=${session.sessionId}`;
    console.log('Headers user %d session %d', userId, session.sessionId);
    return this.headers({
      Cookie: cookie,
      'user-agent': device.info.headers,
    }, userId);
  }

  async headersForAnonymous(userId: number) {
    const user = await User.findFullDataById(userId);
    if (user.devices.length === 0) throw new ErrorHandler(`There are no devices for user ${userId}`);
    const userAgent = randomItem(user.devices).device.info.headers;
    return this.headers({
      'user-agent': userAgent,
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
    if (length === 0) {
      new DataGenerateService([logout]);
    }
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

  async performForUsers(cb: (userId: number) => {}) {
    const result = await db.query(
      `select ses.user_id as userId from sessions ses
        RIGHT JOIN users us on us.user_id = ses.user_id
        WHERE anonymous='false'
        ORDER BY random() LIMIT ${randomInt(2, 10)}`
    );
    let length = result[0].length;
    if (length === 0) {
      new DataGenerateService([login]);
    }
    while (length--) {
      const { userid } = result[0][length] as { userid: number };
      cb(userid);
    }
  }

  async logout() {
    await this.performForUsers(async (userId: number) => {
      try {
        const headers = await this.headersByUser(userId);
        const response = await fetch(`${DataGenerateService.url}users/logout`, { method: 'GET', headers });
        console.log('User %d logout', userId, response.status);
      } catch (e) {
        console.log('User Logout Error %s', e.message);
      }

    });
  }

  async event() {
    await this.performForUsers(async (userid: number) => {
      try {
        const headers = await this.headersByUser(userid);
        const title = randomItem(eventTitles);
        const body = JSON.stringify({
          title,
          data: eventData[title]()
        });
        const response = await fetch(`${DataGenerateService.url}events`, { method: 'POST', headers, body });
        console.log('Event %s user %d created', title, userid, response.status);
      } catch (e) {
        console.log('Event Error %s', e.message);
      }
    });
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

  async adjustData() {
    const rows = await Device.findAll();

    rows.forEach((row) => {
      try {
        let info = JSON.parse(row.info.headers);
        console.log(row.deviceId, info);
        if(info.OS) {
          // row.update({info});
        }
      } catch (e) {
        console.log(e.message);
      }

    })
  }

  static runService() {
    new DataGenerateService([anonymousSession, signUp, userData, logout, login, event]);
    // new DataGenerateService([adjustData]);
  }

}
