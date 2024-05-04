const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadToCloundflare(fileBuffer, fileName) {
    try {
        const s3Client = new S3Client({
            endpoint: `${process.env.CLOUND_FLARE_ENDPOINT}`,
            region: `${process.env.CLOUND_FLARE_REGION}`,
            credentials: {
                accessKeyId: `${process.env.CLOUND_FLARE_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.CLOUND_FLARE_SECRET_KEY}`,
            }
        });

        const params = {
            Bucket: `${process.env.BUCKET_NAME}`,
            Key: fileName,
            Body: fileBuffer,
        };

        const command = new PutObjectCommand(params);

        const uploadResult = await s3Client.send(command);
        console.log(`${fileName} uploaded successfully with status ${uploadResult.$metadata.httpStatusCode}`);
    } catch (err) {
        console.error('Error uploading to Cloudflare R2:', err);
        throw err;
    }
}

module.exports = uploadToCloundflare;
