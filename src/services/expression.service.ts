
export default class ExpressionService {
  static IS_EQUAL_TO = 'is_equal_to';
  static DOES_NOT_EQUAL_TO = 'does_not_equal_to';
  static ONE_OF = 'one_of';
  static NONE_OF = 'none_of';
  static STARTS_WITH = 'starts_with';
  static DOES_NOT_START_WITH = 'does_not_start_with';
  static ENDS_WITH = 'ends_with';
  static DOES_NOT_END_WITH = 'does_not_end_with';
  static CONTAINS = 'contains';
  static DOES_NOT_CONTAIN = 'does_not_contain';
  static EMPTY = 'empty';
  static BETWEEN = 'between';
  static NOT_BETWEEN = 'not_between';
  static GREATER_THAN = 'greater_than';
  static LESS_THAN = 'less_than';
  static IS_GREATER_THAN_OR_EQUAL_TO = 'is_greater_than_or_equal_to';
  static IS_LESS_THAN_OR_EQUAL_TO = 'is_less_than_or_equal_to';

  static expressions() {
    return [this.IS_EQUAL_TO, this.DOES_NOT_EQUAL_TO, this.ONE_OF, this.NONE_OF, this.STARTS_WITH,
      this.DOES_NOT_START_WITH, this.ENDS_WITH, this.DOES_NOT_END_WITH, this.CONTAINS, this.DOES_NOT_CONTAIN,
      this.EMPTY, this.BETWEEN, this.NOT_BETWEEN, this.GREATER_THAN, this.LESS_THAN, this.IS_GREATER_THAN_OR_EQUAL_TO,
      this.IS_LESS_THAN_OR_EQUAL_TO]
  }

}
