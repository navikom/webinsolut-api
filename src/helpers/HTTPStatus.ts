export class HTTPStatus {
  static UNAUTHORIZED: number = 401;
  static SERVER_ERROR: number = 500;
  static PAGE_NOT_FOUND: number = 404;
  static NOT_ACCEPTABLE: number = 406;
  static OK: number = 200;
  static UNAUTHORIZED_MESSAGE: string = "Unauthorized";
  static PAGE_NOT_FOUND_MESSAGE: string = "Page not found";
  static APP_HASNT_FOUND: string = "The app $ has not found";
  static SESSION_OWNED_TO_ANOTHER_DEVICE: string = "The session owned to another device";
  static SESSION_ALREADY_DELETED: string = "The session already deleted";
  static SESSION_EXPIRED: string = "The session is expired";
}
