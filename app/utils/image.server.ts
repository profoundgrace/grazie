/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import fs from 'fs';
import { getLogger } from '~/utils/logger.server';
import sharp from 'sharp';
import { s3Upload } from '~/utils/storage.server';

const log = getLogger('Image Module');

export const imageExtension = (mime) => {
  switch (mime) {
    case 'image/gif':
      return '.gif';
    case 'image/jpeg':
      return '.jpeg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';

    default:
      throw new Error('Image format not supported!');
  }
};

/**
 * Image Processor
 *
 * Accepts a file object of { name, mime, base64 }, decodes it to an image, resizes it, and creates a thumbnail
 *
 * @param object file
 * @param int imageSize
 * @param int thumbSize
 */
export const processImage = async ({
  file,
  imageSize = 200,
  thumbSize = 80
}) => {
  const ext = imageExtension(file?.mime);

  file.path = `uploads/${Date.now()}_temp.${ext}`;
  fs.writeFile(file?.path, file?.base64, 'base64', function (writeError) {
    if (writeError) {
      log.error(writeError);
    } else {
      // Image
      sharp(file?.path)
        .resize({ width: imageSize || 200 })
        .toFile(`uploads/s3/${file?.name}`, (err) => {
          if (err) {
            throw err;
          } else {
            s3Upload({
              file: `uploads/s3/${file?.name}`,
              deleteFile: file?.deleteFile !== null ? file?.deleteFile : false
            });
            // Thumbnail
            sharp(file?.path)
              .resize({ width: thumbSize || 80 })
              .toFile(`uploads/s3/thumbs/${file?.name}`, (err1) => {
                if (err1) {
                  throw err1;
                } else {
                  s3Upload({
                    file: `uploads/s3/thumbs/${file?.name}`,
                    folder: 'thumbs',
                    deleteFile:
                      file?.deleteFile !== null ? file?.deleteFile : false
                  });
                  // Original File is deleted
                  fs.unlink(file?.path, (unlinkError) => {
                    if (unlinkError) {
                      throw unlinkError;
                    }
                  });
                }
              });
          }
        });
    }
  });
};

/**
 * Image Processor
 *
 * Accepts a file object of { name, mime, base64 }, decodes it to an image, resizes it, and creates a thumbnail
 *
 * @param object file
 * @param int imageSize
 * @param int thumbSize
 */
export const processAvatar = async ({
  file,
  imageSizes = { sm: 80, md: 200, lg: 500 }
}) => {
  const ext = imageExtension(file?.mime);
  const animated = file?.mime === 'image/gif' ? true : false;

  file.path = `uploads/s3/avatars/${Date.now()}_temp.${ext}`;
  fs.writeFile(file?.path, file?.base64, 'base64', function (writeError) {
    if (writeError) {
      log.error(writeError);
    } else {
      // lg
      sharp(file?.path, { animated })
        .resize({ height: imageSizes?.lg || 500 })
        .toFile(`uploads/s3/avatars/lg/${file?.name}`, (err) => {
          if (err) {
            throw err;
          } else {
            s3Upload({
              file: `uploads/s3/avatars/lg/${file?.name}`,
              folder: 'avatars/lg',
              deleteFile: file?.deleteFile !== null ? file?.deleteFile : false
            });
            // md
            sharp(file?.path, { animated })
              .resize({ height: imageSizes?.md || 200 })
              .toFile(`uploads/s3/avatars/md/${file?.name}`, (err2) => {
                if (err2) {
                  throw err2;
                } else {
                  s3Upload({
                    file: `uploads/s3/avatars/md/${file?.name}`,
                    folder: 'avatars/md',
                    deleteFile:
                      file?.deleteFile !== null ? file?.deleteFile : false
                  });
                  // sm
                  sharp(file?.path, { animated })
                    .resize({ height: imageSizes?.sm || 80 })
                    .toFile(`uploads/s3/avatars/sm/${file?.name}`, (err3) => {
                      if (err3) {
                        throw err3;
                      } else {
                        s3Upload({
                          file: `uploads/s3/avatars/sm/${file?.name}`,
                          folder: 'avatars/sm',
                          deleteFile:
                            file?.deleteFile !== null ? file?.deleteFile : false
                        });
                        // Original File is deleted
                        fs.unlink(file?.path, (unlinkError) => {
                          if (unlinkError) {
                            throw unlinkError;
                          }
                        });
                      }
                    });
                }
              });
          }
        });
    }
  });
};
