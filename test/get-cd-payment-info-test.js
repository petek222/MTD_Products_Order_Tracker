"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);

let getPaymentInfo = require('../models/payment/get-cd-payment-info');

// Note: Current connection is to Payment Test database (switch to prod as needed)
// Also determine what we want resolved from the calls: recordset / recordsets / whole object?
describe('Payment Info Test', function() {

    it ('Testing a lookup in the payment service table: getChaseAuthorizationVwInfo', async () => {

        let result = await getPaymentInfo.getChaseAuthorizationVwInfo('10683065');

        let check = result.recordset[0];

        Logger.debug(result);
        Logger.debug(check);

        expect(check['AuthOrderId']).to.be.eq('V1402140');

    });

    it ('Testing a lookup in the payment service table: getCreditCardPaymentVwInfo', async () => {

        let result = await getPaymentInfo.getCreditCardPaymentVwInfo('10691047');

        let check = result.recordset[0];

        Logger.debug(result);
        Logger.debug(check);

        expect(check['PaymentAmount']).to.be.eq(396.31);

    });

    it ('Testing a lookup in the payment service table: getConsumerOrderStatus', async () => {

        let result = await getPaymentInfo.getConsumerOrderStatus('10691047');

        let check = result.recordset[0];

        Logger.debug(result);
        Logger.debug(check);

        expect(check['Status']).to.be.eq('PAYMENT_COMPLETE');

    });
});