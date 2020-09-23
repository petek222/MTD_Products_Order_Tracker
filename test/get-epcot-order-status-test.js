"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let epcotHelper = require('../models/epcot/get-epcot-order-status');

// Note: Current connection is to epcot staging database (switch to prod as needed)
// Also determine what we want resolved from the calls: currently resolves data corresponding to ORDER_STATUS_ID
// Do we want the order_status_id resolved ? Or the whole data object ? Or both as it is currently ? Or something else ?
describe('Epcot Status Test', function() {


    // Should this grab offline-token-list???
    it ('Testing the Epcot Status lookup function', async () => {

        var testObject = await epcotHelper.getEpcotOrderStatusInformation('CD0014304F03');

        Logger.debug(testObject);

        expect(testObject['ORDER_STATUS_ID']).to.be.eq(5);
        expect(testObject['DESC']).to.be.eq('Shipped');
        expect(testObject['SHOW_COM_STATUS']).to.be.eq('N');
        expect(testObject['SHOW_COM_HOLDS']).to.be.eq('N');
        expect(testObject['CUSTOMER_DESC']).to.be.eq('Shipped');
    });

    it ('Testing the Epcot Status lookup function on a non-existent product id', async () => {

        var testObject = await epcotHelper.getEpcotOrderStatusInformation('648940');

        Logger.debug(testObject);

        expect(testObject).to.be.null;
    });

    it ('Testing another order in Epcot', async () => {

        var testObject = await epcotHelper.getEpcotOrderStatusInformation('D0001605S1');

        console.log(testObject);
    })
});