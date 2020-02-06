import {MainController} from '@app/controllers/main.controller';
import {Campaign} from '@app/models/campaign.model';
import * as e from 'express';
import {errorResponse, successResponse} from '@app/helpers/HTTPResponse';
import {HTTPStatus} from '@app/helpers/HTTPStatus';
import {RichRequest} from '@app/interfaces/RichRequest';

class CampaignController extends MainController<Campaign> {
  constructor() {
    super(Campaign, 'campaigns');
  }

  async getWithPagination(req: e.Request, res: e.Response): Promise<void> {
    try {
      const data = await Campaign.paginationlist(req as RichRequest);
      res.send(successResponse(data));
    } catch (e) {
      res.status(HTTPStatus.SERVER_ERROR).send(errorResponse(`${this.name}:${e.message}`));
    }
  }
}

export default new CampaignController();
