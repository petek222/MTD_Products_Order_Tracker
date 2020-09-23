var express = require('express');
var router = express.Router();
const serverLevel = process.env.SERVER_LEVEL;
var environmentProperties = require('../properties/environment.json')[serverLevel];
const Logger = require('../log/Logger')(__filename);
const comLookupController = require('../controllers/com/comLookupController');
const FTPController = require('../controllers/ftp/FTPServerController');
const clientController = require('../controllers/client/clientStatusLookupController');
const paymentController = require('../controllers/payment/paymentServiceController');
const epcotController = require('../controllers/epcot/epcotStatusLookupController');

// This is the primary getter called from the route: runs through all services,
// calling all of the necessary controller and putting the data in a JSON object
// COM calls need to be ordered, fields specified, JSON structured/formatted
//
// A LOT of error handling needs to be implemented across the application,
// particularly if some fields return no data (FTP for example, or client (since FTP is dependent on it), etc.)
//
// DEBUG AND ERROR HANDLE TO DEAL WITH NULL RETURNS, ERRORS, ETC. SO IT DOESNT CRASH
async function getAllOrderData(orderNumber) {

    if (orderNumber != null) {

    Logger.debug('orderNumber: ' + orderNumber);

    var dataJSON = new Object();

    // Call to client controller gets order status in client 
    let clientResults = await clientController.getClientStatusByOrderNumber(orderNumber);

        Logger.debug('order-client-status info: ' + clientResults);
        dataJSON.clientResults = clientResults;

        
    // Call to controller checking FTP order status/presence (done backward to avoid file downloads)
    // Won't be called if clientResults is null
    if (clientResults) {

        let ftpResults = await FTPController.checkFTPServerForOrder(clientResults['sourceDetails']);

        Logger.debug('File Presence in FTP Server: ' + ftpResults);
        dataJSON.ftpData = ftpResults;
    }

    else {
        dataJSON.ftpData = { 
        exists: 'false',
        productType: 'N/A',
        filename: 'order does not exist on FTP server',
        isProcessed: false};
    }


    // Call to controller getting various payment service info
    let paymentResults = await paymentController.getPaymentInfoByOrderNumber(orderNumber);

        Logger.debug('payment-service results: ' + paymentResults);
        dataJSON.paymentResults = paymentResults;

    // Call to epcot controller that returns epcot order status information via key-value map
    // NOTE: check 'was order originally placed in epcot' data ? maybe display this more prominently?
    let epcotResults = await epcotController.getEpcotStatusByOrderNumber(orderNumber);

        Logger.debug('epcot status results: ' + epcotResults);
        dataJSON.epcotResults = epcotResults;

    // Call to COM controller gets all COM data, currently just for 'history' env
    //
    // This call to COM should probably be split/changed for offline, open, and history
    // offline before everything else, open and history now ?
    let comOfflineData = await comLookupController.getCOMDataFromOriginalOrderNumber(orderNumber, 'offline');

        Logger.debug('comOfflineData: ' + comOfflineData);
        dataJSON.comOfflineData = comOfflineData;

    let comOpenData = await comLookupController.getCOMDataFromOriginalOrderNumber(orderNumber, 'open');

        Logger.debug('comOpenData: ' + comOpenData);
        dataJSON.comOpenData = comOpenData;
    
    let comHistoryData = await comLookupController.getCOMDataFromOriginalOrderNumber(orderNumber, 'history');

        Logger.debug('comHistoryData: ' + comHistoryData);
        dataJSON.comHistoryData = comHistoryData;

    return dataJSON;

    }
}

module.exports.getAllOrderData = getAllOrderData;