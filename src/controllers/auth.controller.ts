import { Request, Response } from "express";
import AuthService from "@app/services/auth.service";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { LoginSuccessResponse } from "@app/models/types/models";
import { HTTPStatus } from "@app/helpers/HTTPStatus";
import { RichRequest } from "@app/interfaces/RichRequest";

class AuthController {
  async create(req: Request, res: Response) {
    try {
      const data: LoginSuccessResponse = await AuthService.createUser(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await AuthService.authUser(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const data = await AuthService.changePassword(req);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const data = await AuthService.forgotPassword(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async resetStart(req: Request, res: Response) {
    try {
      const data = await AuthService.resetPassword(req);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async resetComplete(req: Request, res: Response) {
    try {
      const data = await AuthService.resetComplete(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async anonymous(req: Request, res: Response) {
    try {
      const data = await AuthService.authAsAnonymous(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await AuthService.logout(req as RichRequest);
      res.send(successResponse(true));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`auth:${e.message}`));
    }
  }
}

export default new AuthController();
