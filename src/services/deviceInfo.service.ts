import { DeviceInfoType } from "@app/models/types/models";

type Data = {
  name: string;
  value: string;
  version: string;
}

export class DeviceInfoService {
  headers: string[] = [];
  dataos: Data[] = [
    { name: "Windows Phone", value: "Windows Phone", version: "OS" },
    { name: "Windows", value: "Win", version: "NT" },
    { name: "Kindle", value: "Silk", version: "Silk" },
    { name: "PlayBook", value: "PlayBook", version: "OS" },
    { name: "BlackBerry", value: "BlackBerry", version: "/" },
    { name: "Macintosh", value: "Mac", version: "OS X" },
    { name: "Linux", value: "Linux", version: "rv" },
    { name: "Palm", value: "Palm", version: "PalmOS" }
  ];
  databrowser: Data[] = [
    { name: "Chrome", value: "Chrome", version: "Chrome" },
    { name: "Firefox", value: "Firefox", version: "Firefox" },
    { name: "Safari", value: "Safari", version: "Version" },
    { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
    { name: "Opera", value: "Opera", version: "Opera" },
    { name: "BlackBerry", value: "CLDC", version: "CLDC" },
    { name: "Mozilla", value: "Mozilla", version: "Mozilla" }
  ];

  constructor(userAgent: string) {
    this.headers.push(userAgent);
  }

  private match(data: Data[]) {
    let info;
    try {
      info = JSON.parse(this.headers[0]);
      if (info.androidId) {
        return { name: "Android", version: info.release };
      } else if (info.vendorId) {
        return { name: "IOS", version: info.release };
      }
    } catch (e) {
    }

    for (let i = 0; i < data.length; i += 1) {
      const string = this.headers.join(" ");
      const regex = new RegExp(data[i].value, "i");
      const match = regex.test(string);
      if (match) {
        const regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
        let matches = string.match(regexv);
        let matchFound;
        let version = "";
        if (matches) {
          if (matches[1]) {
            matchFound = matches[1];
          }
        }
        if (matchFound) {
          matches = matchFound.split(/[._]+/);
          for (let j = 0; j < matches.length; j += 1) {
            if (j === 0) {
              version += matches[j] + ".";
            } else {
              version += matches[j];
            }
          }
        } else {
          version = "0";
        }
        return {
          name: data[i].name,
          version: parseFloat(version)
        };
      }
    }
    return { name: "unknown", version: 0 };
  }

  info(): DeviceInfoType {
    const os = this.match(this.dataos);
    const browser = this.match(this.databrowser);
    return {
      headers: this.headers[0],
      OS: os,
      BROWSER: browser
    }
  }

}
