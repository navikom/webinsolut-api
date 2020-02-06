import {MainController} from '@app/controllers/main.controller';
import {PixartPicture} from '@app/models/pixart/picture.model';
import * as e from 'express';
import {errorResponse, successResponse} from '@app/helpers/HTTPResponse';
import {HTTPStatus} from '@app/helpers/HTTPStatus';

class PictureController extends MainController<PixartPicture> {
  constructor() {
    super(PixartPicture, 'pixart-pictures');
  }

  async save(req: e.Request & {files: any}, res: e.Response): Promise<void> {
    try {
      res.send(successResponse(await PixartPicture.savePictures(req.files || [], req.body.categoryId)));
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
      const data = await PixartPicture.findAllWithPagination({limit, offset});
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

export default new PictureController();
