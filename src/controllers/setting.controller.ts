import * as e from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { HTTPStatus } from "@app/helpers/HTTPStatus";
import CONFIG from "@app/config/config";
import EventsService from "@app/services/event.service";
import ExpressionService from "@app/services/expression.service";

class Setting {
  async fetch(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse({
        cloudinaryPath: CONFIG.cloudinary_path,
        cloudinaryFolder: CONFIG.cloudinary_folder,
        bee: CONFIG.bee_plugin_client_id + "___" + CONFIG.bee_plugin_client_secret,
        systemEventsList: EventsService.systemEventsList(),
        customEventsList: [],
        expressions: ExpressionService.expressions()
      }));

    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`Setting:${e.message}`));
    }
  }
}

export default new Setting();
