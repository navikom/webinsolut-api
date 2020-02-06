import {MainController} from '@app/controllers/main.controller';
import {Event} from '@app/models/event.model';
import * as e from 'express';
import {errorResponse, successResponse} from '@app/helpers/HTTPResponse';
import {HTTPStatus} from '@app/helpers/HTTPStatus';

class EventController extends MainController<Event> {
  constructor() {
    super(Event, 'events');
  }

  async getWithPagination(req: e.Request, res: e.Response): Promise<void> {
    if (!req.query) {
      return super.getWithPagination(req, res);
    }
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);

      const data = await Event.paginationGroupUser(page, pageSize);
      const count = await Event.countBySingleUser();
      res.send(successResponse({
          page, pageSize,
          count: count.length,
          items: data
        }
      ));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getByUserWithPagination(req: e.Request, res: e.Response): Promise<void> {
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);
      const data = await Event.paginationByUser(page, pageSize, req.params.userId);
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

export default new EventController();
