import { Request, Response } from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { MigrateModel } from "@app/models/migrate";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

class MigrateController {
  async exportData(req: Request, res: Response) {
    try {
      res.send(successResponse(await MigrateModel.exportToFile(req)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`migrate:${e.message}`));
    }
  }

  async insertData(req: Request, res: Response) {
    try {
      res.send(successResponse(await MigrateModel.insert()));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`migrate:${e.message}`));
    }
  }
}

export default new MigrateController();
