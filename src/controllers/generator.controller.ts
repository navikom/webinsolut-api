import { Request, Response } from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { HTTPStatus } from "@app/helpers/HTTPStatus";
import { DataGenerateService } from "@app/services/generator/dataGenerate.service";

class GeneratorController {
  async run(req: Request, res: Response) {
    try {
      DataGenerateService.runService();
      res.send(successResponse("Successfully ran"));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`generator:${e.message}`));
    }
  }
}

export default new GeneratorController();
