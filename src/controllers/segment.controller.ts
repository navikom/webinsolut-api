import {MainController} from '@app/controllers/main.controller';
import {Segment} from '@app/models/segment.model';

class SegmentController extends MainController<Segment> {
  constructor() {
    super(Segment, 'segments');
  }
}

export default new SegmentController();
