"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let clientHelper = require('../models/client/get-client-order-status');

// Note: We are most likely going to want to only grab certain fields from the client, rather than all of them: CHECK THIS 
describe('Testing the order-service-client status getter', function () {

    it ('Testing the basic functionality of the client getter', async () => {

        let clientObject = await clientHelper.getStatusRecordByOrderId(11156933);
        Logger.debug('Data obtained via getter: ' + clientObject);

        // Can't enforce expectations on dates: incompatible format 
        expect(clientObject['orderId']).to.be.eq('11156933');
        expect(clientObject['offlineTokenList']).to.be.eq('["21000041880"]');
        expect(clientObject['epcotOrderNumber']).to.be.eq('"TB7226283E19"');
        expect(clientObject['sourceDetails']).to.be.null;
        expect(clientObject['site']).to.be.null;
        expect(clientObject['orderType']).to.be.null;
    });

    it ('Testing the client getter on a non-existent order-id', async () => {

        let clientObject = await clientHelper.getStatusRecordByOrderId(22222222);
        Logger.debug('Data obtained via getter: ' + clientObject);

        expect(clientObject).to.be.undefined;

    });

    it ('Testing alphanumeric order_id on order_service_client status table', async () => {

        // THE ENV IS THE ISSUE: Adding the Local env leads to no data return 
        let clientObject = await clientHelper.getStatusRecordByOrderId('D0001605S1');
        
        console.log(clientObject);
    })
});