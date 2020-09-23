"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
const sftp = require('../sftp');
const ftpController = require('../controllers/ftp/FTPServerController');

// We can hopefully string together these calls in some sort of FTP controller 
// Commented out call does test the controller. Also using route for random testing as needed. (currently, FTP server stuff)
describe('FTP Server Controller Test', function() {

    it('Testing the functionality of the FTP Server Controller', async () => {

        let result = await ftpController.checkFTPForOrder('-cubcadet-20190730_203501566.xml');

        console.log('TEST RESULT');
        console.log(result);

        expect(result.isProcessed).to.be.false;
    });
});