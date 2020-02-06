import jwtDecode from 'jwt-decode';
import validator from 'validator';
import {Request} from 'express';
import {ExtractJwt} from 'passport-jwt';
import {Auth} from '@app/models';
import {User} from '@app/models/user.model';

import {AuthType, JWTTokenType} from '@app/types';
import {LoginSuccessResponse} from '@app/models/types/models';
import {ErrorHandler} from '@app/helpers/ErrorHandler';
import {OldTokens} from '@app/models/oldTokens.model';
import {RichRequest} from '@app/interfaces/RichRequest';

export default class AuthService {
  static createUser(req: RichRequest): Promise<LoginSuccessResponse> {
    const userInfo: AuthType = req.body;
    if (!userInfo.email || !validator.isEmail(userInfo.email)) throw new ErrorHandler('invalid-email');
    if(!userInfo.password || userInfo.password.trim().length < 6) throw new ErrorHandler('wrong-password');

    return Auth.registration(req);

  }

  static async authUser(req: RichRequest): Promise<LoginSuccessResponse> {
    if (req.body.grantType === 'password') {
      return AuthService.authByEmailPassword(req);
    } else {
      return Auth.refresh(req);
    }
  }

  static async authAsAnonymous(req: RichRequest): Promise<LoginSuccessResponse> {
    return await Auth.anonymous(req);
  }

  static async authByEmailPassword(req: RichRequest): Promise<LoginSuccessResponse> {
    if (!req.body.email || !validator.isEmail(req.body.email)) throw new ErrorHandler('invalid-email');

    if (!req.body.password) throw new ErrorHandler('wrong-password');

    const data = await Auth.login(req);
    if (!data) throw new Error('wrong-password');

    return data;
  }

  static async changePassword(req: Request) {
    if(!req.body.password || req.body.password.trim().length < 6) throw new ErrorHandler('wrong-password');
    if(!req.body.newPassword) throw new ErrorHandler('new-password-does-not-provided');

    return Auth.changePassword(req);
  }

  static async forgotPassword(req: RichRequest) {
    if (!req.body.email || !validator.isEmail(req.body.email)) throw new ErrorHandler('invalid-email');
    return Auth.addResetToken(req.body.email, req.iapp ? req.iapp.title : undefined);
  }

  static async resetPassword(req: Request) {

    const token = unescape(req.params.token);
    const data = await jwtDecode(token) as JWTTokenType;
    if (!data) throw new ErrorHandler('wrong-reset-token');
    if (data.exp < Math.floor(Date.now() / 1000)) throw new ErrorHandler('reset-token-expired');
    const user = await User.findByResetToken(token);
    if(!user) throw new ErrorHandler('user-not-found');
    return true;
  }

  static async resetComplete(req: Request) {
    const token = unescape(req.params.token);
    const data = await jwtDecode(token) as JWTTokenType;
    if (!data) throw new ErrorHandler('wrong-reset-token');
    if (data.exp < Math.floor(Date.now() / 1000)) throw new ErrorHandler('reset-token-expired');
    const {password, repeatPassword} = req.body;
    if(!password || password.toString().trim().length < 6) throw new ErrorHandler('wrong-password');
    if(!repeatPassword) throw new ErrorHandler('repeat-password-does-not-provided');
    await Auth.resetComplete(req, data.userId);
    return true;
  }

  static async getUserById(id: number, appTitle?: string) {
    let user = User.findById(id);
    if (!user) throw new ErrorHandler('user-not-found');
    return user;
  }

  // static async getUserByIdWithRefreshToken(id: number): Promise<User> {
  //   let user = User.findByIdWithTokens(id);
  //   if (!user) throw new ErrorHandler('user-not-found');
  //   return user;
  // }

  // static async checkRefreshToken(token: string) {
  //   const tokenIsOld = await OldTokens.isOldToken(token);
  //   if (tokenIsOld) {
  //     throw new ErrorHandler('refresh-token-already-closed');
  //   }
  //   const data = await jwtDecode(token) as JWTTokenType;
  //   if (!data) throw new ErrorHandler('wrong-token');
  //
  //   if (data.exp < Math.floor(Date.now() / 1000)) throw new ErrorHandler('refresh-token-expired');
  //   const user = await AuthService.getUserByIdWithRefreshToken(data.userId);
  //   if (!user) throw new ErrorHandler('user-not-found');
  //   return user;
  // };

  static async logout(req: RichRequest) {
    Auth.logout(req);
  }

  static async oldToken(req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) return;
    OldTokens.create({token});
  }
}
