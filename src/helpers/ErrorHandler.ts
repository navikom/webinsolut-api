export class ErrorHandler extends Error {
  status?: number;

  constructor(message: string) {
    super(message);
  }
}
