var express = require('express');
var router = express.Router();
const serverLevel = process.env.SERVER_LEVEL;
var environmentProperties = require('../properties/environment.json')[serverLevel];
const Logger = require('../log/Logger')(__filename);
const comLookupController = require('../controllers/com/comLookupController');
const FTPController = require('../controllers/ftp/FTPServerController');
const clientHelper = require('../models/client/get-client-order-status');
const paymentController = require('../controllers/payment/paymentServiceController');
const epcotController = require('../controllers/epcot/epcotStatusLookupController');
const getAllData = require('../controllers/general-lookup');
const util = require('util');
var io = require('socket.io').listen(80);

console.dir(environmentProperties);

var azureDBConfig = {
    user: environmentProperties.AZURE_MMSERVICES_DB_USERNAME,
    database: environmentProperties.AZURE_MMSERVICES_DB_NAME,
    password: environmentProperties.AZURE_MMSERVICES_DB_PASSWORD,
    server: environmentProperties.AZURE_MMSERVICES_DB_SERVER_NAME,
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

const loader = require('mm-common-config/mm-common-config'); 


// NOTE: ERROR OF NOT FINDING XML FILES IN IMPORTS ???? KEEPS HAPPENING EVERY SO OFTEN ?!?!?!?!?!?!
// This will be the primary route that 'takes' an order number and processess it for all the various services/getters
// Any other routes of importance to include ?
// NOTE: FTP server still only processing one per execution, make sure this issue is addressed !!
router.get('/getOrderInfo', function (req, res) {
    
    let orderNumber = req.query.orderNumber;
    let importsFolder = 'imports/ftp-imports/';

    // Alter this path to grab the XML/FTP data from a different sftp directory as desired 
    //
    // Figure out how to get around this directory specification/downloading everything from FTP
    let path = "FILL IN PATH"; 

    // We are probably going to want to put all of our data in a giant JSON object or map: delaying until data is selected 
    //
    // Note: Make sure the 'translation' of order numbers / order ids across services is acconuted for if need be
    // Order of calls in the route (with temporary FTP Helper):
    // 1. FTP Server
    // 2. Client
    // 3. COM Offline 
    // 4. Payment Service
    // 5. Epcot
    // 6. COM Open
    // 7. COM Historical 
    // All of the above are present, what else we could still do:
    // a. SFCC before everything
    // b. WM / UPS url for tracking pick pack ship to the consumer's door
    console.log(orderNumber);

    if (orderNumber) {
    console.log('Getting all order information based on order number...')

    getAllData.getAllOrderData(orderNumber, path, importsFolder).then(result => {
        
    // Then, we could do a WM / UPS call after these, and any SFCC calls before everything if eventually implemented 

    // Check Client for Order: D0001605S1

    // Sends back JSON object 'result'
    console.log("All Processing Complete!");
    res.send(result); 

    })
}
});


// Route to test the configLoader node module, as included above from 'mm-common-config'
router.get('/testLoaderModule', function (req, res) {
    let orderNumber = req.query.orderNumber;
    loader.configLoader("order-service-client", azureDBConfig).then(configLoad=>{

        console.dir(configLoad,{depth:null});
        console.dir(configLoad.get("general"),{depth:null});
        console.dir(configLoad.get("general").get("general"), {depth:null})
        res.send("returning information for order: " + configLoad.get("general"));
    
    }).catch(err=>{
        console.log(err.message);
        throw(err);
    });
});

// Add other routes here to run getters 

module.exports = router;