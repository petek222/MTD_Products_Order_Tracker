const Logger = require('../../log/Logger')(__filename);
const serverLevel = process.env.SERVER_LEVEL;
const settle = require('promise-settle');
const route = require('../../routes/orderLookup');
const clientHelper = require('../../models/client/get-client-order-status');
 
function getClientStatusByOrderNumber (order_number) {

    console.log('processing order-service-client status');

    return new Promise((resolve, reject) => {

        try {
            clientHelper.getStatusRecordByOrderId(order_number).then(result => {

                Logger.debug('Order-service-client result: ' + result);
                resolve(result);
            })
            .catch(err => {
                Logger.error(err);
                reject(err);
            })
        }
        catch(err) {
            Logger.error(err);
        }
    });
}

module.exports.getClientStatusByOrderNumber = getClientStatusByOrderNumber;