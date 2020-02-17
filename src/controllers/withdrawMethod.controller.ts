import { MainController } from "@app/controllers/main.controller";
import { WithdrawMethod } from "@app/models/withdrawMethod.model";

class WithdrawMethodController extends MainController<WithdrawMethod> {
  constructor() {
    super(WithdrawMethod, "withdraw-methods");
  }
}

export default new WithdrawMethodController();
