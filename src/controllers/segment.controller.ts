import { MainController } from "@app/controllers/main.controller";
import { Segment } from "@app/models/segment.model";
import * as e from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

class SegmentController extends MainController<Segment> {
  constructor() {
    super(Segment, "segments");
  }

  async update(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await Segment.save(req)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new SegmentController();
