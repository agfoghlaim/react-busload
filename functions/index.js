const functions = require('firebase-functions');
// const gcs = require('@google-cloud/storage')();
const admin = require('firebase-admin');
admin.initializeApp()
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const fs = require('fs');
//const mkdirp = require('mkdirp-promise');




// // File extension for the created JPEG files.
// const PNG_EXTENSION = '.png';

// /**
//  * When an image is uploaded in the Storage bucket it is converted to JPEG automatically using
//  * ImageMagick.
//  */
// exports.imageToJPG = functions.storage.object().onFinalize(async (object) => {
//   const filePath = object.name;
//   const baseFileName = path.basename(filePath, path.extname(filePath));
//   const fileDir = path.dirname(filePath);
//   // const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: JPEG_EXTENSION}));
//   const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: 'profile', ext: PNG_EXTENSION}));
//   const tempLocalFile = path.join(os.tmpdir(), filePath);
//   const tempLocalDir = path.dirname(tempLocalFile);
//   const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);
//  console.log("in the right function")
//   // Exit if this is triggered on a file that is not an image.
//   if (!object.contentType.startsWith('image/')) {
//     console.log('This is not an image.');
//     return null;
//   }

//   // Exit if the image is already a JPEG.
//   // if (object.contentType.startsWith('image/png')) {
//   //   console.log('Already a png.');
//   //   return null;
//   // }

//   const bucket = admin.storage().bucket(object.bucket);
//   // Create the temp directory where the storage file will be downloaded.
//   await mkdirp(tempLocalDir);
//   // Download file from bucket.
//   await bucket.file(filePath).download({destination: tempLocalFile});
//   console.log('The file has been downloaded to', tempLocalFile);
//   // Convert the image to png using ImageMagick.
//  //if (!object.contentType.startsWith('image/png')) {
//     //console.log('not a png, converting');
//     await spawn('convert', [tempLocalFile, '-resize', '300x300', tempLocalJPEGFile]);
//     console.log('PNG image created at', tempLocalJPEGFile);
// //}

 

//   //await spawn('convert',[tempLocalJPEGFile, '-resize', '300x300', tempLocalJPEGFile])

//   //console.log("marie s part done, resized...")

//   await bucket.upload(tempLocalJPEGFile, {destination: JPEGFilePath});
//   console.log('png image uploaded to Storage at', JPEGFilePath);

  
//   //       metadata:metadata
//   // Once the image has been converted delete the local files to free up disk space.
//   fs.unlinkSync(tempLocalJPEGFile);
//   fs.unlinkSync(tempLocalFile);
//   return null;
// });

//this function is good to resize to 300 but keeps aspect ratio
exports.onImgUpload = functions.storage.object().onFinalize(object => {

  const bucket = object.bucket; 
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  console.log("got some stuff")


  if(object.resourceState === 'not_exists'){
    console.log("was a delete, returning");
    return;
  }
  // if(path.basename(filePath).startsWith('resized-') ){
  //   console.log("returning, file already resized")
  //   return;
  // }

  //const destinationBucket = gcs.bucket(bucket);//ie keep in same bucket
  const destinationBucket = admin.storage().bucket(bucket);
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };

  return destinationBucket.file(filePath).download({
    destination:  tempFilePath
  }).then(()=>{
    return spawn('convert',[tempFilePath, '-resize', '300x300', tempFilePath])

  }).then(()=>{
    // return destinationBucket.upload(tempFilePath,{
    //     destination: 'resized-' + path.basename(filePath),
    //     metadata:metadata
    // })
    const baseFileName = path.basename(filePath, path.extname(filePath));

    const fileDir = path.dirname(filePath);
    const extension =path.extname(filePath);
    const whereToPut = path.normalize(path.format({dir: fileDir, name: baseFileName, ext:extension}));

    return destinationBucket.upload(tempFilePath, {destination: whereToPut});
  })
});




// exports.onImgUpload = functions.storage.object().onFinalize(object => {

//   const bucket = object.bucket; 
//   const filePath = object.name; // File path 
//   const contentType = object.contentType; //content type.



//   if(object.resourceState === 'not_exists'){
//     console.log("was a delete, returning");
//     return;
//   }
  

//   //const destinationBucket = gcs.bucket(bucket);//ie keep in same bucket
//   const destinationBucket = admin.storage().bucket(bucket);
//   const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
//   const metadata = { contentType: contentType };

//   return destinationBucket.file(filePath).download({
//     destination:  tempFilePath
//   }).then(()=>{
//     return spawn('convert',[tempFilePath, '-resize', '300x300', '-crop', '200x200', tempFilePath])

//   })
//   // .then(()=>{
//   //   return spawn('crop', [tempFilePath, '300', tempFilePath])

//   // })
//   .then(()=>{
//     const baseFileName = path.basename(filePath, path.extname(filePath));

//     const fileDir = path.dirname(filePath);
//     const extension =path.extname(filePath);
//     const whereToPut = path.normalize(path.format({dir: fileDir, name: baseFileName, ext:extension}));

//     return destinationBucket.upload(tempFilePath, {destination: whereToPut});
//   })
//   .then(()=>fs.unlinkSync(tempFilePath))
  
// });






