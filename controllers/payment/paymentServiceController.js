const Logger = require('../../log/Logger')(__filename);
const serverLevel = process.env.SERVER_LEVEL;
const settle = require('promise-settle');
const route = require('../../routes/orderLookup');
const paymentHelper = require('../../models/payment/get-cd-payment-info');

function getPaymentInfoByOrderNumber(order_number) {

    console.log('processing payment service information');

    let paymentServiceObject = new Object();

    return new Promise((resolve, reject) => {

        paymentHelper.getChaseAuthorizationVwInfo(order_number).then(chaseResults => {

            Logger.debug(chaseResults.recordset[0]);
            //paymentServiceMap.set('chaseAuthInfo', chaseResults.recordset[0]);
            paymentServiceObject["chaseAuthInfo"] = chaseResults.recordset[0];
    
            paymentHelper.getCreditCardPaymentVwInfo(order_number).then(creditCardResults => {
    
                Logger.debug(creditCardResults.recordset[0]);
                // paymentServiceMap.set('creditCardInfo', creditCardResults.recordset[0]);
                paymentServiceObject["creditCardInfo"] = creditCardResults.recordset[0];
    
                paymentHelper.getConsumerOrderStatus(order_number).then(consumerOrderResults => {
    
                    Logger.debug(creditCardResults.recordset[0]);
                    //paymentServiceMap.set('consumerOrderStatus', consumerOrderResults.recordset[0]);
                    paymentServiceObject["consumerOrderStatus"] = consumerOrderResults.recordset[0];

                    Logger.debug(paymentServiceObject);
                    resolve(paymentServiceObject);
                })
                .catch(err => {
                    Logger.error(err);
                    reject(err);
                });
            })
            .catch(err => {
                Logger.error(err);
                reject(err);
            })
        })
        .catch(err => {
            Logger.error(err);
            reject(err);
        })
    });
}

module.exports.getPaymentInfoByOrderNumber = getPaymentInfoByOrderNumber;