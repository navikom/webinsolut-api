import { Request, Response } from "express";
import { MainController } from "@app/controllers/main.controller";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { Crash } from "@app/models/crash.model";
import { HTTPStatus } from "@app/helpers/HTTPStatus";
import { RichRequest } from "@app/interfaces/RichRequest";

class CrashController extends MainController<Crash> {
  constructor() {
    super(Crash, "crashes");
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      res.send(successResponse(await Crash.createOne(req as RichRequest)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new CrashController();
