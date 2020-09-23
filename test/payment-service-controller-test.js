"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let paymentController = require('../controllers/payment/paymentServiceController');

describe('Epcot Status Test', function() {

    it('Testing the Payment Service controller', async () => {

        let paymentMap = await paymentController.getPaymentInfoByOrderNumber('10683065');
    
        expect(paymentMap.get('consumerOrderStatus')['Status']).to.be.eq('SHIP_COMPLETE');
    });

});
