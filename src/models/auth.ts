import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";
import CONFIG from "@app/config/config";
import { User } from "@app/models/user.model";
import { AuthType } from "@app/types";
import { ErrorHandler } from "@app/helpers/ErrorHandler";
import { LoginSuccessResponse } from "@app/models/types/models";
import { UsersApps } from "@app/models/usersApps.model";
import { UsersDevices } from "@app/models/usersDevices.model";
import EventsService from "@app/services/event.service";
import { EmailService } from "@app/services/email.service";
import { RichRequest } from "@app/interfaces/RichRequest";
import { UsersRegions } from "@app/models/usersRegions.model";
import Sessions from "@app/models/session.model";

export const getRPJWT = function (userId: number) {
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  return jwt.sign({ userId }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
};

const response = function (req: RichRequest): LoginSuccessResponse {
  return {
    anonymous: !req.session!.authorized,
    user: req.session!.user,
  };
};

enum Actions {
  LOGIN,
  REGISTER,
  SESSION
}

class AuthModel {
  private async loginHelper(req: RichRequest, action?: Actions) {

    if (action === Actions.LOGIN) {
      EventsService.userLogin(req.session!.user.userId, req);
    } else if (action === Actions.REGISTER) {
      EventsService.userRegister(req.session!.user.userId, req);
    }
  }

  async registration(req: RichRequest): Promise<LoginSuccessResponse> {
    const body: AuthType | null = req.body;
    if (!body) throw new ErrorHandler("invalid-email");
    let { email, password } = body;

    const exists = await User.findByEmailParanoid(email);
    if (exists) {
      throw new ErrorHandler("user-exists");
    }
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hashSync(password, salt);
    const object = {
      email,
      password,
      lastSession: new Date()
    };

    let user: User | undefined = req.user as User;
    if (!user || user.email) {
      user = await User.createOne(object);
    } else {
      await User.signup(user, object);
    }
    req.session!.user = await User.findById(user.userId);
    Sessions.updateUser(req.session);
    req.session!.authorized = true;
    await this.loginHelper(req, Actions.REGISTER);
    // EmailService.sendRegistration(user);

    return response(req);
  }

  async anonymous(req: RichRequest): Promise<LoginSuccessResponse> {
    const user: User = req.session!.user;
    await UsersApps.addLinkIfNotExists(user, req);
    await UsersDevices.addLinkIfNotExists(user, req);
    await UsersRegions.addLinkIfNotExists(user, req);
    req.session!.user = await User.findById(user.userId);
    return response(req);
  }

  async login(req: RichRequest): Promise<LoginSuccessResponse> {
    let { email, password } = req.body;
    let user = await User.findByEmail(email);
    if (!user) {
      throw new ErrorHandler("user-not-found");
    }
    const checked = await bcrypt.compareSync(password, user.password);
    if (checked) {
      await user.update({ lastSession: new Date() });
      req.session!.user = await User.findById(user.userId);
      Sessions.updateUser(req.session);
      req.session!.authorized = true;
      await this.loginHelper(req, Actions.LOGIN);
      return response(req);
    }
    throw new ErrorHandler("wrong-password");
  }

  async changePassword(req: Request) {
    let { password, newPassword } = req.body;
    let reqUser = req.user as User;
    let user = await User.findByEmail(reqUser.email);
    if (!user) {
      throw new ErrorHandler("user-not-found");
    }
    const checked = await bcrypt.compareSync(password, user.password);
    if (checked) {
      const salt = await bcrypt.genSaltSync(10);
      User.setPassword(user, await bcrypt.hashSync(newPassword, salt));
      return true;
    }
    throw new ErrorHandler("wrong-password");
  }

  async refresh(req: RichRequest): Promise<LoginSuccessResponse> {
    return response(req);
  }

  async addResetToken(email: string, appTitle?: string) {
    let user = await User.findByEmail(email);
    if (!user) {
      throw new ErrorHandler("invalid-email");
    }
    const token = getRPJWT(user.userId);
    User.setResetPasswordToken(user, token);
    await EmailService.sendResetPassword(user, token, appTitle);
    return true;
  }

  async resetComplete(req: Request, userId: number) {
    let { password, repeatPassword } = req.body;
    if (password !== repeatPassword) throw new ErrorHandler("repeat-password-not-equal");
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hashSync(password, salt);
    const object = {
      password,
      resetPasswordToken: null,
    };
    const user = await User.findById(userId);
    EmailService.sendThatPasswordIsChanged(user);
    await user.update(object);
  }

  logout(req: RichRequest) {
    req.session!.authorized = false;
    EventsService.userLogout(req.session!.user.userId, req);
  }
}

export default new AuthModel();
