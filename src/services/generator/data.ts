import { DeviceType } from "@app/models/types/models";
import { randomId, randomInt, randomItem, randomItemCount, randomString } from "@app/utils/utils";

type LocaleType = {
  language: string;
  code: string;
  country: string;
  timezone: string;
}

export const names = ["Leena", "Ayana", "Jena", "Maryalice", "Jodee", "Gerda", "Karlyn", "Aletha", "Yuko", "Lenore", "Monica", "Arminda", "So", "Maire", "Omega", "Alethia", "Monnie", "Natosha", "Marcie", "Jaimie", "Giselle", "Veta", "Hiedi", "Marni", "Masako", "Zora", "Vinita", "Inge", "Angelique", "Casie", "Hyun", "Jonna", "Marsha", "Ranee", "Dorie", "Kenyetta", "Lizzette", "Shanda", "Celine", "Stefanie", "Phylicia", "Brittni", "Pearle", "Waneta", "Avis", "Agueda", "Jacinda", "Lillian", "Pauletta", "Katy", "Lee", "Brice", "Bryon", "Alonso", "Boyce", "Kurt", "Floyd", "Keven", "Trevor", "Vernon", "King", "Oswaldo", "Tristan", "Mark", "Sammy", "Fernando", "Otha", "Randal", "Huey", "Guadalupe", "Sung", "Elbert", "Leif", "Jon", "Roland", "Omar", "Jamaal", "Rudy", "Rueben", "Julius", "Danilo", "Dexter", "Giuseppe", "Garfield", "Lowell", "Jonah", "Moises", "Patricia", "Michale", "Cletus", "Bobbie", "Tobias", "Anthony", "Lindsey", "Benito", "Darrell", "Renaldo", "Omer", "Ty", "Rayford"];

export const locales: LocaleType[] = [
  { language: "en", code: "en-US", country: "US", timezone: "America/New_York" },
  { language: "en", code: "en-US", country: "US", timezone: "America/Los_Angeles" },
  { language: "en", code: "en-US", country: "US", timezone: "America/Chicago" },
  { language: "en", code: "en-GB", country: "GB", timezone: "Europe/London" },
  { language: "en", code: "en-US", country: "CA", timezone: "America/Toronto" },
  { language: "fr", code: "fr-CA", country: "CA", timezone: "America/Toronto" },
  { language: "fr", code: "fr-FR", country: "FR", timezone: "Europe/Paris" },
];

export const devices: DeviceType[] = [
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": 23,
    "manufacturer": "HUAWEI",
    "brand": "Huawei",
    "model": "ALE-L21",
    "device": "hwALE-H"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(26, 28),
    "manufacturer": "HUAWEI",
    "brand": "Huawei",
    "model": "P10",
    "device": "P10"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "GOOGLE",
    "brand": "Google",
    "model": "Pixel/XL",
    "device": "Pixel/XL"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "GOOGLE",
    "brand": "Google",
    "model": "Pixel 2/XL",
    "device": "Pixel 2/XL"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "GOOGLE",
    "brand": "Google",
    "model": "Pixel 3a/XL",
    "device": "Pixel 3a/XL"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "HTC",
    "brand": "HTC",
    "model": "Dream",
    "device": "Dream"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "HTC",
    "brand": "HTC",
    "model": "Hero",
    "device": "Hero"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "Samsung Electronics",
    "brand": "Samsung",
    "model": "Galaxy S7/Edge",
    "device": "Galaxy S7/Edge"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "Samsung Electronics",
    "brand": "Samsung",
    "model": "Galaxy S8/+",
    "device": "Galaxy S8/+"
  },
  {
    "androidId": randomId(),
    "release": 6.0,
    "sdk": randomInt(25, 28),
    "manufacturer": "Samsung Electronics",
    "brand": "Samsung",
    "model": "Galaxy Note 8",
    "device": "Galaxy Note 8"
  },
  // IOS
  {
    "name": "My iPhone",
    "systemName": "iPhone3,3",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPhone 4",
    "localizedModel": "iPhone 4",
    "vendorId": randomId(),
    "release": new Date("September 9, 2014"),
  },
  {
    "name": "My iPhone",
    "systemName": "iPhone6,2",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPhone 5s",
    "localizedModel": "iPhone 5s",
    "vendorId": randomId(),
    "release": new Date("2016-03-21"),
  },
  {
    "name": "My iPhone",
    "systemName": "iPhone8,1",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPhone 6s",
    "localizedModel": "iPhone 6s",
    "vendorId": randomId(),
    "release": new Date("2018-09-12"),
  },
  {
    "name": "My iPhone",
    "systemName": "iPhone10,6",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPhone X",
    "localizedModel": "iPhone X",
    "vendorId": randomId(),
    "release": new Date("2018-09-12"),
  },
  {
    "name": "My iPhone",
    "systemName": "iPhone11,8",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPhone XR",
    "localizedModel": "iPhone XR",
    "vendorId": randomId(),
    "release": new Date("2019-09-10"),
  },
  {
    "name": "My iPad",
    "systemName": "iPad7,2",
    "systemVersion": `${randomInt(6, 13)}.${randomInt(0, 9)}`,
    "model": "iPad Pro 12.9-inch 2",
    "localizedModel": "iPad Pro 12.9-inch 2",
    "vendorId": randomId(),
    "release": new Date("2018-03-27"),
  }
];

export const eventTitles = ["Purchase", "Payment", "Download file", "Open article", "Leave comment", "Open ticket", "Start chat", "Leave message"];
const items = devices.map(device => device.model);

type PurchaseItemType = {
  title: string, quantity: number, price: number
}

export const eventData = {
  [eventTitles[0]]: () => {
    const list: PurchaseItemType[] = randomItemCount(items, randomInt(1, 5)).map((title: string) => ({
      title,
      quantity: randomInt(1, 3),
      price: randomInt(200, 1000)
    }));
    const amount = list.reduce((a, b) => {
      return a + b.price * b.quantity;
    }, 0);
    return {
      items: list,
      tax: amount / 1.2 * .2,
      amount
    }
  },
  [eventTitles[1]]: () => ({
    amount: randomInt(10, 50)
  }),
  [eventTitles[2]]: () => ({
    fileName: `About ${randomItem(items)}`
  }),
  [eventTitles[3]]: () => ({
    articleName: `About ${randomItem(items)}`,
    author: `${randomItem(names)} ${randomString(randomInt(5, 10))}`
  }),
  [eventTitles[4]]: () => ({
    comment: `Hey learn about ${randomItem(items)}`,
    recipient: `${randomItem(names)} ${randomString(randomInt(5, 10))}`
  }),
  [eventTitles[5]]: () => ({
    title: `May you help me with ${randomItem(items)}`,
  }),
  [eventTitles[6]]: () => {
    const name = `${randomItem(names)} ${randomString(randomInt(5, 10))}`;
    return {
      title: `Hey ${name}, let's start a chat?`,
      room: randomInt(1, 100),
    }
  },
  [eventTitles[7]]: () => {
    const name = `${randomItem(names)} ${randomString(randomInt(5, 10))}`;
    return {
      message: `Hey ${name}, How are you?`
    }
  }
};
