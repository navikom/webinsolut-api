import {MainController} from '@app/controllers/main.controller';
import {Region} from '@app/models/region.model';

class RegionController extends MainController<Region> {
  constructor() {
    super(Region, 'regions');
  }
}

export default new RegionController();
