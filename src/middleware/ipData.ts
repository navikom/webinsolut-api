import { Request, Response } from "express";
import geoip, { Lookup } from "geoip-lite";
import { RichRequest } from "@app/interfaces/RichRequest";
import { Region } from "@app/models/region.model";
import { CookieType, RegionType } from "@app/models/types/models";
import { getCookies } from "@app/helpers/HTTPRequest";
import { HTTPLocale } from "@app/helpers/HTTPLocale";

export default function (req: Request, res: Response, next: Function) {
  let ip = req.ip;//'178.120.58.242';//req.ip;
  // IPV6 addresses can include IPV4 addresses
  // So req.ip can be '::ffff:86.3.182.58'
  // However geoip-lite returns null for these
  if (ip.includes("::ffff:")) {
    ip = ip.split(":").reverse()[0]
  }

  const lookedUpIP: Lookup & { timezone: string } = geoip.lookup(ip) as Lookup & { timezone: string };
  if ((ip === "127.0.0.1")) {
    console.log("ERROR %s", "This won't work on localhost");
  }
  const data: RegionType = {};
  data.ip = ip;
  if (!lookedUpIP) {
    console.log("ERROR %s", "occurred while trying to process the ip information");
  } else {
    data.city = lookedUpIP!.city;
    data.country = lookedUpIP!.country;
    data.region = lookedUpIP!.region;
    data.timezone = lookedUpIP!.timezone;
    data.lt = lookedUpIP!.ll[0];
    data.lg = lookedUpIP!.ll[1];
  }

  (async function (req, res, next) {
    req.region = await Region.findOrCreateOne(data);
    req.locale = HTTPLocale.from(req);
    next();
  })(req as RichRequest, res, next);

}
