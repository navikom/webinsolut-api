import { Request } from "express";
import { Device } from "@app/models/device.model";
import { Region } from "@app/models/region.model";
import App from "@app/models/app.model";
import { HTTPLocale } from "@app/helpers/HTTPLocale";

export interface RichRequest extends Request {
  device: Device | null;
  region: Region | null;
  locale: HTTPLocale | null;
  iapp: App | null;
}
