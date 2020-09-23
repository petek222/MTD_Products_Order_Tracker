const Logger = require('../../log/Logger')(__filename);
const serverLevel = process.env.SERVER_LEVEL;
const settle = require('promise-settle');
const route = require('../../routes/orderLookup');
const ftpHelper = require('../../models/ftp/ftp-helper');
const remoteFTPHelper = require('../../models/ftp/remote-ftp-helper');
let FTP = require('../../config/ftp/ftp-server');

// IMPLEMENT TRY CATCH
// NOTE: We may want te path to be "selectable" from the UI (temp, prod, staging, etc.)

function checkFTPServerForOrder(filename) {

    return new Promise((resolve, reject) => {

        console.log('Processing FTP Server...');

        let FTPData = new Object();

        generateFTPFilenameData(filename).then(result => {

            FTPData = result;

            console.log('FTPData: ');
            console.log(FTPData);

            resolve(FTPData);
        })
        .catch(err => {
            Logger.error(err);
            reject(err);
        })
    })
}

// takes filename from above main controller function, loads everything into maps as desired, checks against supplied filename 
async function generateFTPFilenameData(filename) {

    console.log('FILENAME:');
    console.log(filename);

    let FTPServerData;
    let FTPServerProcessedData;

    if (serverLevel == 'local') {
        FTPServerData = FTP.local.FILENAME_TO_REMOTE_DIRECTORY_MAP;
        FTPServerProcessedData = FTP.local.FILENAME_TO_REMOTE_PROCESSED_DIR_MAP;
    }
    if (serverLevel == 'dev') {
        FTPServerData = FTP.dev.FILENAME_TO_REMOTE_DIRECTORY_MAP;
        FTPServerProcessedData = FTP.dev.FILENAME_TO_REMOTE_PROCESSED_DIR_MAP;
    }
    if (serverLevel == 'test') {
        FTPServerData = FTP.test.FILENAME_TO_REMOTE_DIRECTORY_MAP;
        FTPServerProcessedData = FTP.test.FILENAME_TO_REMOTE_PROCESSED_DIR_MAP;
    }
    if (serverLevel == 'prod') {
        FTPServerData = FTP.prod.FILENAME_TO_REMOTE_DIRECTORY_MAP;
        FTPServerProcessedData = FTP.prod.FILENAME_TO_REMOTE_PROCESSED_DIR_MAP;
    }
 
        // Paths for non-processed directories
        let mtdparts = FTPServerData.mtdparts;
        let mtdpartsca = FTPServerData.mtdpartsca;
        let cubcadet = FTPServerData.cubcadet;
        let cubcadetca = FTPServerData.cubcadetca;

        // Paths for the processed directories
        let mtdpartsP = FTPServerProcessedData.mtdparts;
        let mtdpartscaP = FTPServerProcessedData.mtdpartsca;
        let cubcadetP = FTPServerProcessedData.cubcadet;
        let cubcadetcaP = FTPServerProcessedData.cubcadetca;

        // Loads Map of filenames corresponding to path
        // Try to find a more efficient way of doing this 
        let mtdpartsData = await remoteFTPHelper.getFTPFilenameListByPath(mtdparts);

        let mtdpartscaData = await remoteFTPHelper.getFTPFilenameListByPath(mtdpartsca);

        let cubcadetData = await remoteFTPHelper.getFTPFilenameListByPath(cubcadet);

        let cubcadetcaData = await remoteFTPHelper.getFTPFilenameListByPath(cubcadetca);

        let mtdpartsPData = await remoteFTPHelper.getFTPFilenameListByPath(mtdpartsP);

        let mtdpartscaPData = await remoteFTPHelper.getFTPFilenameListByPath(mtdpartscaP);

        let cubcadetPData = await remoteFTPHelper.getFTPFilenameListByPath(cubcadetP);

        let cubcadetcaPData = await remoteFTPHelper.getFTPFilenameListByPath(cubcadetcaP);

        // This call to checker will return desired FTP information for given filename 
        let FTPOrderObject = await checkMapsForFilename(filename, mtdpartsData, mtdpartscaData, cubcadetData, cubcadetcaData, mtdpartsPData, mtdpartscaPData, cubcadetPData, cubcadetcaPData); 


        console.log('FTPOrderObject: ');
        console.log(FTPOrderObject);

        return(FTPOrderObject);
}

// Intermediary function checks ALL filename maps for filename and its corresponding data object
function checkMapsForFilename(filename, mtdpartsData, mtdpartscaData, cubcadetData, cubcadetcaData, mtdpartsPData, mtdpartscaPData , cubcadetPData, cubcadetcaPData) {

    console.log('HERE');
    console.log(cubcadetData);

    if (mtdpartsData && mtdpartsData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'mtdparts',
                filename: filename,
                isProcessed: false
            }
        );
    }

    if (mtdpartscaData && mtdpartscaData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'mtdpartsca',
                filename: filename,
                isProcessed: false
            }
        );
    }
    if (cubcadetData && cubcadetData.has(filename)) {
        return(
            {  
                exists: true,
                productType: 'cubcadet',
                filename: filename,
                isProcessed: false
            }
        );
    }
    if (cubcadetcaData && cubcadetcaData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'cubcadetca',
                filename: filename,
                isProcessed: false
            }
        );
    }
    if (mtdpartsPData && mtdpartsPData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'mtdparts',
                filename: filename,
                isProcessed: true
            }
        );
    }
    if (mtdpartscaPData && mtdpartscaPData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'mtdpartsca',
                filename: filename,
                isProcessed: true
            }
        );
    }
    if (cubcadetPData && cubcadetPData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'cubcadet',
                filename: filename,
                isProcessed: true
            }
        );
    }
    if (cubcadetcaPData && cubcadetcaPData.has(filename)) {
        return(
            {
                exists: true,
                productType: 'cubcadetca',
                filename: filename,
                isProcessed: true
            }
        );
    }
    
    else {
        return (
            {
                exists: 'false',
                productType: 'N/A',
                filename: 'order does not exist on FTP server',
                isProcessed: false
            }
        );
    }
}

module.exports.checkFTPServerForOrder = checkFTPServerForOrder;