const AWS = require('aws-sdk');
const path = require('path');
const config = require('config');

const {
  bucket,
  accessKey,
  secretKey,
} = config.s3;

class S3Client {
  constructor () {
    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
  
    this.s3 = new AWS.S3();
  }

  getSignedUrl(file) {
    const {
      originalname: fileName,
    } = file;

    const params = {
      Bucket: bucket,
      Key: `images/${Date.now()}_${path.basename(fileName)}`,
      ACL: 'public-read',
    };

    return {
      url: `https://${bucket}.s3.amazonaws.com/${params.Key}`,
      params,
    };
  }

  uploadImage(file, params) {
    const {
      originalname: fileName,
      buffer: fileData,
    } = file;

    const localParams = {
      ...params,
      Body: fileData,
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(localParams, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }
}

module.exports = S3Client;
