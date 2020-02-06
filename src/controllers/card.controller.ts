import {MainController} from '@app/controllers/main.controller';
import {Card} from '@app/models/card.model';

class CardController extends MainController<Card> {
  constructor() {
    super(Card, 'cards');
  }
}

export default new CardController();
