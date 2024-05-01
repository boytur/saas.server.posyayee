/** upload file to b2 clound strage */

const B2 = require('backblaze-b2');
const b2 = new B2({
    applicationKeyId: process.env.APK_KEY_ID,
    applicationKey: process.env.APK_KEY
});

async function uploadToB2(fileBuffer, fileName) {
    try {
        await b2.authorize();
        const response = await b2.getBucket({ bucketName: `${process.env.BUCKET}` });
        const uploadUrlResponse = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID });

        if (!fileBuffer) {
            throw new Error('File buffer is undefined.');
        }

        const upload = await b2.uploadFile({
            uploadUrl: uploadUrlResponse.data.uploadUrl,
            uploadAuthToken: uploadUrlResponse.data.authorizationToken,
            fileName: fileName,
            data: fileBuffer,
            onUploadProgress: null,
        });

        console.log(`${fileName} uploaded successfully with status`, upload.status);
    } catch (err) {
        console.log('Error uploading to B2:', err);
        throw err;
    }
}
module.exports = uploadToB2;