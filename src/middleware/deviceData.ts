import { Request, Response } from "express";
import { DeviceInfoService } from "@app/services/deviceInfo.service";
import { Device } from "@app/models/device.model";
import { RichRequest } from "@app/interfaces/RichRequest";

export default async function (req: Request, res: Response, next: Function) {
  (async function (req, res, next) {
    if (req.headers["user-agent"]) {
      const deviceDataService = new DeviceInfoService(req.headers["user-agent"]);
      const info = deviceDataService.info();
      const device: Device = await Device.findOrCreateOne(info);
      req.device = device;
    } else {
      req.device = await Device.findByPk(1);
    }

    next();
  })(req as RichRequest, res, next);
}
