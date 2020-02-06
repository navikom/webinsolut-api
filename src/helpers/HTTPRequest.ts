import {Request} from 'express';
import {CookieType} from '@app/models/types/models';

export function getCookies(request: Request) {
  const cookies: CookieType = {};
  request.headers && ['cookie', 'x-cookie'].forEach((key: string) => {
    request.headers[key] && (request.headers[key] as string)!.split(';').forEach(function(cookie) {
      const parts = cookie.match(/(.*?)=(.*)$/);
      if(parts && parts[1]) {
        cookies[ parts[1].trim() ] = (parts[2] || '').trim();
      }
    });
  });
  return cookies;
}
