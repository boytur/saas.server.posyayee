const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

async function deleteFromCloudflare(fileName) {
    try {

        fileName = fileName.replace(`${process.env.URL}`, '');

        const s3Client = new S3Client({
            endpoint: `${process.env.CLOUDFLARE_ENDPOINT}`,
            region: `${process.env.CLOUDFLARE_REGION}`,
            credentials: {
                accessKeyId: `${process.env.CLOUDFLARE_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.CLOUDFLARE_SECRET_KEY}`,
            }
        });

        const params = {
            Bucket: `${process.env.BUCKET_NAME}`,
            Key: fileName,
        };

        const command = new DeleteObjectCommand(params);

        const deleteResult = await s3Client.send(command);
        console.log(`${fileName} deleted successfully with status ${deleteResult.$metadata.httpStatusCode}`);
    } catch (err) {
        console.error('Error deleting from Cloudflare R2:', err);
        throw err;
    }
}

module.exports = deleteFromCloudflare;
