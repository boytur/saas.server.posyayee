/** delete file in b2 clound strage */

const B2 = require('backblaze-b2');
const b2 = new B2({
    applicationKeyId: process.env.APK_KEY_ID,
    applicationKey: process.env.APK_KEY
});

/** Delete file */
async function deleteFileB2(fileName) {
    try {
        if (!fileName || fileName === "https://placehold.co/600x400/EEE/31343C" || !fileName.startsWith("https://f005.backblazeb2.com/file/posyayee/")) {
            console.log('File name is undefined or null.');
            return;
        }

        console.log('Deleting file from B2:', fileName);

        await b2.authorize();
        const response = await b2.getBucket({ bucketName: `${process.env.BUCKET}` });

        // Find the file by its name using the listFileNames API
        const listFilesResponse = await b2.listFileNames({
            bucketId: process.env.BUCKET_ID,
            startFileName: fileName,
            maxFileCount: 1,
        });

        if (listFilesResponse.data.files.length === 0) {
            console.log(`File ${fileName} not found in B2. It might have already been deleted.`);
            return;
        }

        // Get the file ID from the listFilesResponse
        const fileId = listFilesResponse.data.files[0].fileId;

        // Delete the file by fileId
        await b2.deleteFileVersion({
            fileName: fileName,
            fileId: fileId,
        });

        console.log(`${fileName} deleted successfully from B2.`);
    } catch (err) {
        console.log('Error deleting file from B2:', err);
        throw err;
    }
}

module.exports = deleteFileB2;