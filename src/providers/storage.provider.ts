import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { InvalidImageException } from '../modules/common/exceptions/invalid-image.exception';

export class StorageProvider {
  static UPLOADS_PATH = './uploads';

  static AVATARS_DIR_PATH = `${this.UPLOADS_PATH}/avatars`;

  static PRODUCT_IMAGES_DIR_PATH = `${this.UPLOADS_PATH}/products-images`;

  static uploadFileOptions = (imagePath: string) => ({
    storage: diskStorage({
      destination: imagePath,
      filename: (req, file, cb) => {
        if (!/\.(jpg|jpeg|png|gif)$/i.test(file.originalname)) {
          cb(new InvalidImageException(), file.filename);
        }

        const filename: string =
          path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  });

  static avatarUploadFileOptions = this.uploadFileOptions(
    this.AVATARS_DIR_PATH,
  );

  static productImageUploadFileOptions = this.uploadFileOptions(
    this.PRODUCT_IMAGES_DIR_PATH,
  );
}
