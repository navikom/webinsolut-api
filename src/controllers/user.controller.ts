import {errorResponse, successResponse} from '@app/helpers/HTTPResponse';
import * as e from 'express';
import {User} from '@app/models/user.model';
import {MainController} from '@app/controllers/main.controller';
import {ErrorHandler} from '@app/helpers/ErrorHandler';
import AuthService from '@app/services/auth.service';
import {HTTPStatus} from '@app/helpers/HTTPStatus';
import {RichRequest} from '@app/interfaces/RichRequest';

class UserController extends MainController<User> {
  constructor() {
    super(User, 'users');
  }

  async getOne(req: e.Request, res: e.Response): Promise<void> {
    try {
      const user = await User.findFullDataById(parseInt(req.params.id));
      if(!user) throw new ErrorHandler('user-not-found');
      user.refreshToken = '';
      res.send(successResponse(user));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async update(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await User.updateOne(parseInt(req.params.id), req as RichRequest)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }

  }

  async getAll(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await User.list()));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async getWithPagination(req: e.Request, res: e.Response): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);
      const offset = page * pageSize;
      const limit = offset + pageSize;
      res.send(successResponse({
        page, pageSize,
        count: await User.count(),
        items: await User.paginationlist(offset, limit)
      }));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getReferralsWithPagination(req: e.Request, res: e.Response): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);

      const data = await User.paginationReferralsList(req.params.userId, page, pageSize);
      res.send(successResponse({
        page, pageSize,
        count: data.count,
        items: data.rows
      }));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async delete(req: e.Request, res: e.Response): Promise<void> {
    const user = req.user as User;
    try {
      res.send(successResponse(await User.delete(user)));
      AuthService.oldToken(req);
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async updateRole(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await User.updateRole(req.params.userId, req.params.roleId)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async updateSubscription(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await User.updateSubscription(req.params.userId, req.params.channel, req.params.action)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new UserController();
