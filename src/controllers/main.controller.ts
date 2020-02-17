import { errorResponse, successResponse } from "@app/helpers/HTTPResponse";
import * as e from "express";
import { ModelCtor } from "sequelize-typescript";
import { ErrorHandler } from "@app/helpers/ErrorHandler";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

export abstract class MainController<M> {
  model: ModelCtor;
  name: string;

  protected constructor(model: ModelCtor, name: string) {
    this.model = model;
    this.name = name;
  }

  async create(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await this.model.create(req.body)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async delete(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await this.model.destroy({ where: { [this.model.primaryKeyAttribute]: req.params.id } })));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getOne(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await this.model.findByPk(req.params.id)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getAll(req: e.Request, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await this.model.findAll()));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async update(req: e.Request, res: e.Response): Promise<void> {
    try {
      const instance = await this.model.findByPk(req.params.id);
      if (!instance) throw new ErrorHandler("instance-not-exists");
      res.send(successResponse(await instance.update(req.body)));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getWithPagination(req: e.Request, res: e.Response): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);
      const offset = page * pageSize;
      const limit = offset + pageSize;
      const data = await this.model.findAndCountAll({ limit, offset });
      res.send(successResponse({
          page, pageSize,
          count: data.count,
          items: data.rows
        }
      ));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

}
