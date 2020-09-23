const Logger = require('../../log/Logger')(__filename);
const serverLevel = process.env.SERVER_LEVEL;
const settle = require('promise-settle');
const route = require('../../routes/orderLookup');
const epcotHelper = require('../../models/epcot/get-epcot-order-status');

function getEpcotStatusByOrderNumber(order_number) {

    console.log('processing Epcot status');

    return new Promise((resolve, reject) => {

        epcotHelper.getEpcotOrderStatusInformation(order_number).then(result => {

            Logger.debug('Epcot Status Result: ' + result);
            resolve(result);
        })
        .catch(err => {
            Logger.error(err);
            reject(err);
        });
    });
}

module.exports.getEpcotStatusByOrderNumber = getEpcotStatusByOrderNumber;