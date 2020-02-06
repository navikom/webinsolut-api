import https from 'https';
import querystring from 'querystring';
import CONFIG from '@app/config/config';
import {ErrorHandler} from '@app/helpers/ErrorHandler';

export class Settings {
  static beeAuth(callback: (err: ErrorHandler | null, data?: any) => void ) {
    let credentials = querystring.stringify({
      grant_type: 'password',
      client_id: CONFIG.bee_plugin_client_id,
      client_secret: CONFIG.bee_plugin_client_secret
    });

    // define beefree connection endpoint
    let options = {
      hostname: 'auth.getbee.io',
      method: 'POST',
      path: '/apiauth',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(credentials)
      }
    };

    // create the http request object
    let request = https.request(options, (response) => {

      // expect the status code to be 200, else is error
      if(response.statusCode != 200){
        return callback(new ErrorHandler(`unexpected http status code: ${response.statusCode}`));
      }

      let buffer: any[] = [];
      response.setEncoding('utf8');

      // on data recived add data to the buffer
      response.on('data', (data: any) => {
        buffer.push(data);
      });

      // on all data recived parse response body
      response.on('end', () => {
        let data = JSON.parse(buffer.join(''));
        return callback(null, data);
      });
    });

    // listen on error events
    request.on('error', (err) => {
      return callback(err, null);
    });

    // send data
    request.write(credentials);

    // end client side request
    request.end();
  }
}
