import { MainController } from "@app/controllers/main.controller";
import { ACategory } from "@app/models/aCategory.model";

class AppCategoryController extends MainController<ACategory> {
  constructor() {
    super(ACategory, "app-category");
  }
}

export default new AppCategoryController();
