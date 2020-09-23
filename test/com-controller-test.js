"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let comHelper = require('../models/com/get-com-order-info');
let comController = require('../controllers/com/comLookupController');
//let ftpImports = require('../imports/ftp-imports');

const sftp = require('../sftp');
// PATH example (when running test order): /commerceshared/temp/orders/mtdparts


// Commented out call does test the controller. Also using route for random testing as needed. (currently, FTP server stuff)
describe('COM Controller Test', function() {

    it ('Testing various steps of the COM controller', async () => {

        comController.getCOMDataFromOriginalOrderNumber('D0001605S1');

    });

});