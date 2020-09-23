"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let ftpHelper = require('../models/ftp/ftp-helper');
const sftp = require('../sftp');

// Errors to address: When no XML files exist in the directory
//
// We can hopefully string together these calls in some sort of FTP controller 
// Commented out call does test the controller. Also using route for random testing as needed. (currently, FTP server stuff)
describe('FTP Server Helper Test', function() {

    it ('Testing the functionality of the ftp server helper', async () => {

        let path = "/commerceshared/temp/orders/mtdparts"; // This path can change depending on the desired lookup directory / ftp folder
        let importsFolder = 'imports/ftp-imports/';


        await ftpHelper.getFTPFileListByPath(path, importsFolder);
        //ftpHelper.clearFTPImports(importsFolder);
        var orderNumArray = await ftpHelper.getOrderNumbersFromImports(importsFolder);

        var orderIsPresent = await ftpHelper.checkFTPForOrder('M0011402S1', orderNumArray);

        console.log(orderIsPresent);

    });

});