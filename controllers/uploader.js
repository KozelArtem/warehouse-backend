const Promise = require('bluebird');

const S3Client = require('../lib/s3');

const S3Uploader = new S3Client();

const uploadSingle = async (req, res) => {
  try {
    const result = await S3Uploader.getSignedUrl(req.file);
    res.status(200).send(result.url);

    await S3Uploader.uploadImage(req.file, result.params);
  } catch (err) {
    console.error(err);
    
    if (!res.headersSent) {
      res.status(500).send(err);
    }
  }
};

const uploadMultiple = async (req, res) => {
  try {
    const data = req.files.map(i => S3Uploader.getSignedUrl(i));
    const locations = data.map(i => i.url);

    res.status(200).send(locations);

    Promise.mapSeries(req.files, (file, i) => S3Uploader.uploadImage(file, data[i].params));
  } catch (err) {
    console.error(err);
    
    if (!res.headersSent) {
      res.status(500).send(err);
    }
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
