"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let comHelper = require('../models/com/get-com-order-info');

// Note: Current connection is to epcot staging database (switch to prod as needed)
// Also determine what we want resolved from the calls: currently resolves data corresponding to ORDER_STATUS_ID
// Do we want the order_status_id resolved ? Or the whole data object ? Or both as it is currently ? Or something else ?
//
// Note: cannot enforce dates/unicode/weird encypted parts in expectations due to syntactic issues 
// Also: Note the amount of whitespace that many of the COM queries retrieve (many have a ton of trailing whitespace,
// or are wholly a large chunk of varying whitespace)
describe('Epcot Status Test For COM Helper', function() {

    it ('Testing basic functionality of com getter: getEpcotOrderDetails', async () => {

        // Fill in
        var comInfoObject = await comHelper.getEpcotOrderDetails('D0001605S1');

        Logger.debug(comInfoObject);

        expect(comInfoObject['BILL_TO_NAME']).to.be.eq('DUANE BARRY');
        expect(comInfoObject['SALES_ORDER_ID']).to.be.eq(6434839);
        expect(comInfoObject['INTERNAL_HEADER_TYPE']).to.be.eq('1');
        expect(comInfoObject['COM_COMPANY_NUMBER']).to.be.eq(55);
    });

    it ('Testing the basic functionality of a com getter: getCOMOrderBySalesOrderId', async () => {

        var comInfoObject = await comHelper.getCOMOrderBySalesOrderId('6434839');

        Logger.debug(comInfoObject);

        expect(comInfoObject['SALES_ORDER_ID']).to.be.eq(6434839);
        expect(comInfoObject['OFFLINE_TOKEN_COM']).to.be.eq(21000042660,);
        expect(comInfoObject['COM_QUOTE_ORDER_NUMBER']).to.be.eq('5332254');
        expect(comInfoObject['COM_ORDER_STATUS']).to.be.eq('50');
    });

    it ('Testing the basic functionality of a com getter: getOrderHeaderByCOMOrderNumber', async () => {

        var comInfoObject = await comHelper.getOrderHeaderByCOMOrderNumber('History', '5332254', '55', '1');

        Logger.debug(comInfoObject);

        expect(comInfoObject['BWCVNB']).to.be.eq('5332254');
        expect(comInfoObject['BWAQTX']).to.be.eq('CONSUMER DIRECT POWER EQUIP VSMC   ');
        expect(comInfoObject['BWAFVN']).to.be.eq('NATEK     ');
        expect(comInfoObject['BWD0NB']).to.be.eq(1190715);
    });

    it ('Testing the basic functionality of a com getter: getLineItemByCOMOrderNumber', async () => {

        var comInfoObject = await comHelper.getLineItemByCOMOrderNumber('5332254', '55', '1'); // No 'type' param needed for line item

        Logger.debug(comInfoObject);

        expect(comInfoObject['GGALTX']).to.be.eq('BC490:TRIM:SS+:17             ');
        expect(comInfoObject['GGAFYV']).to.be.eq('                                  ');
        expect(comInfoObject['GGALDT']).to.be.eq(1190717);
        expect(comInfoObject['GGAIVN']).to.be.eq('AMBP6XFR  ');
    });

    it ('Testing the basic functionality of a com getter: getOrderHeaderByCOMOrderNumber', async () => {

        var comInfoObject = await comHelper.getOrderDetailByCOMOrderNumber('History', '5332254', '55', '1');

        Logger.debug(comInfoObject);

        expect(comInfoObject['DRALTX']).to.be.eq('BC490:TRIM:SS+:17             ');
        expect(comInfoObject['DRFYVA']).to.be.eq(101.3677192);
        expect(comInfoObject['DRACTM']).to.be.eq(120019);
    });

    it ('Testing the basic functionality of a com getter: getShipmentHeaderByCOMOrderNumber', async () => {

        var comInfoObject = await comHelper.getShipmentHeaderByCOMOrderNumber('History', '5332254', '55', '1');

        Logger.debug(comInfoObject);

        expect(comInfoObject['DHB1TX']).to.be.eq('PHONE: 4445557778                  ');
        expect(comInfoObject['DHAPTX']).to.be.eq('MTDSW TUCSON FINISHED GOODS   ');
        expect(comInfoObject['DHABD1']).to.be.eq(17);
        expect(comInfoObject['DHGGNB']).to.be.eq(435040);

    });

    // This is for non-history tests: doesn't like Offline order header at the moment 
    it ('Testing Open/Offline lookup functionality', async () => {

        var x = await comHelper.getOrderHeaderByCOMOrderNumber('Open', '5332254', '55', '1');

        expect(x).to.be.null;
    })
});
