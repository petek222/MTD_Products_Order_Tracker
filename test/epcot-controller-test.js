"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let epcotController = require('../controllers/epcot/epcotStatusLookupController');
//let ftpImports = require('../imports/ftp-imports');



// Commented out call does test the controller. Also using route for random testing as needed. (currently, FTP server stuff)
describe('Epcot Controller Test', function() {

    it ('Testing the Epcot Order Status Controller', async () => {

        let epcotStatus = await epcotController.getEpcotStatusByOrderNumber('CD0014304F03');

        console.log(epcotStatus);

        // Logger.debug(epcotStatus);
        // expect(epcotStatus['DESC']).to.be.eq('Shipped');
    });
});