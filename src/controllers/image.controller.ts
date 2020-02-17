import { MainController } from "@app/controllers/main.controller";
import { Image } from "@app/models/image.model";

class ImageController extends MainController<Image> {
  constructor() {
    super(Image, "images");
  }

  async upload() {

  }
}

export default new ImageController();
