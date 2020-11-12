/**
 * API endpoints to handle uploads to AWS S3
 * 
 * See /src/S3Uploader.js for client-side example
 */
const aws = require('aws-sdk');
aws.config.region = 'ca-central-1';
const Router = require('express').Router;
const router = Router();

// CHANGE THIS to the name of your bucket in AWS S3
// Note that bucket names must be *globally unique*
// IRL, this is best stores in a .env file
const BUCKET_NAME = 'black-ignite-example';


// Keep images in an array
// (could be a DB, IRL)
const imagesDB = [];

const s3 = new aws.S3();

router.post('/presign-upload', async (req, res) => {
  console.log('req body', req.body);

  // Add a timestamp to the file name
  // to ensure all file names in S3 are unique
  // (Note the in S3, a file name is called a "key")
  const key = `${Date.now()}-${req.body.filename}`;

  // Create a "presigned URL", to give back to the client (our React app)
  // This will allow the client to upload the file directly to S3
  // using axios, without having direct access to our AWS credentials.
  // 
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property
  s3.createPresignedPost( {
    Bucket: BUCKET_NAME,
    Fields: {
      key: key,
    },
    // The link will only be valid for 900 seconds (15 minutes)
    // This is a security feature
    Expires: 900,
  }, (err, data) => {
    if (err) {
      console.error(err);
      res.send(500);
      return;
    }

    // Store the location of the file, for later use
    // IRL, you would save this info to a database
    //send that information to Black_Ignite DB
    imagesDB.push({ bucket: BUCKET_NAME, key: key });

    // The data that we send back includes a url for axios to use,
    // as well as headers that contain temporary credentials
    // for uploading the file.
    res.send(data);
  })

});

router.get('/files', (req, res) => {
  // IRL, we'd grab our image records from our DB, containing
  // the S3 bucket and key.
  //
  // Generate a "signed" URL for each image. This allows the client
  // to access the image file, without having direct access to our AWS credentials.
  const urls = imagesDB.map(img => {
    return s3.getSignedUrl('getObject', {
      Bucket: img.bucket,
      Key: img.key,
      Expires: 900
    });
  });
  
  res.send(urls);
});

module.exports = router;