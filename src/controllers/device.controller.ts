import {MainController} from '@app/controllers/main.controller';
import {Device} from '@app/models/device.model';

class DeviceController extends MainController<Device> {
  constructor() {
    super(Device, 'devices');
  }
}

export default new DeviceController();
