import App from "@app/models/app.model";
import { MainController } from "@app/controllers/main.controller";
import * as e from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

class AppController extends MainController<App> {
  constructor() {
    super(App, "apps");
  }

  async create(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await App.createApp(req.body)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.errors && e.errors[0] && e.errors[0].message || e.message}`));
    }
  }

  async getOne(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await App.findById(req.params.id)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async update(req: e.Request & { files: any }, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await App.updateData(req.params.id, req.body, req.files)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async sortImages(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await App.sortImages(req.params.id, req.body)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async deleteAppImage(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await App.deleteAppImage(req.params.id, req.params.imageId)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new AppController();
