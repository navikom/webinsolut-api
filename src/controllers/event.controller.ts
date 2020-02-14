import * as e from 'express';
import {MainController} from '@app/controllers/main.controller';
import {Event} from '@app/models/event.model';
import {errorResponse, successResponse} from '@app/helpers/HTTPResponse';
import {HTTPStatus} from '@app/helpers/HTTPStatus';
import { RichRequest } from '@app/interfaces/RichRequest';
import EventsService from '@app/services/event.service';

class EventController extends MainController<Event> {
  constructor() {
    super(Event, 'events');
  }

  async create(req: RichRequest, res: e.Response): Promise<void> {
    try {
      EventsService.createEvent(req.body.title, req.iuser!.userId, req, req.body.data);
      res.send(successResponse(true));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }

  async getWithPagination(req: e.Request, res: e.Response): Promise<void> {
    if (!req.query) {
      return super.getWithPagination(req, res);
    }
    try {
      const page = parseInt(req.params.page);
      const pageSize = parseInt(req.params.pageSize);

      const data = await Event.paginationlist(page, pageSize);
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
