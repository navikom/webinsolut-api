import {MainController} from '@app/controllers/main.controller';
import {Payment} from '@app/models/payment.model';

class PaymentController extends MainController<Payment> {
  constructor() {
    super(Payment, 'payments');
  }
}

export default new PaymentController();
