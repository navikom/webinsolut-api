import {MainController} from '@app/controllers/main.controller';
import {PixartCategory} from '@app/models/pixart/category.model';

class CategoryController extends MainController<PixartCategory> {
  constructor() {
    super(PixartCategory, 'pixart-categories');
  }
}

export default new CategoryController();
