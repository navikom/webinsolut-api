import {v2, UploadApiOptions} from 'cloudinary';
import {dataUri} from '@app/middleware/uploader';

const uploader = v2.uploader;

export class CloudinaryService {
  static async upload(file: any, publicId: string, folder: string, options: UploadApiOptions = {}) {
    try {
      const image = await uploader.upload(dataUri(file).content, {public_id: publicId, folder, ...options}, (err, res) => {
        console.log('Image upload_stream error: %s, res: %s', err, res);
      });
    } catch (err) {
      console.log('Image upload', err.message);
    }
  }

  static async delete(publicId: string, folder: string) {
    try {
      const res = await uploader.destroy(`${folder}/${publicId}`, {invalidate: true});
      console.log('Image delete result: %s', res);
    } catch (e) {
      console.log('Image delete error: %s', e.message);
    }
  }

}
