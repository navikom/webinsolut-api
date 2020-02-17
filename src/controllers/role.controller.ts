import { MainController } from "@app/controllers/main.controller";
import { Role } from "@app/models/role.model";
import * as e from "express";
import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

class RoleController extends MainController<Role> {
  constructor() {
    super(Role, "roles");
  }

  async getAll(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await Role.list()));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new RoleController();
