import { Request } from "express";
import Sessions from "@app/models/session.model";

module.exports = function SessionSequelize(Store: any) {
  class SequelizeStore extends Store {
    request: () => Request;

    constructor(options: any) {
      super(options)
      this.request = options.request;
    }

    set(sid: string, data: any, fn: (err: string) => {}) {
      super.set(sid, data, fn).then((session: Sessions) => {
        session.update({ userId: this.request().session!.user.userId });
      });
    }
  }

  return SequelizeStore;
};
