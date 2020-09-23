"use strict";

const settle = require('promise-settle');

const Logger = require('../../log/Logger')(__filename);
const ProcessConfig = require('../../config/process-config');

const AzureMsSqlDBHelper = require('../databases/ms-sql/azure/azure-ms-sql-db-helper');
const OrderStatusSQL = require('../../config/azure/azure-sql');
const OrderStatusRecord = require('../client/order-status-record');

const azureMsSqlDBHelper = new AzureMsSqlDBHelper().getInstance();

// Note: We are most likely going to want to only grab certain fields from the client, rather than all of them: CHECK THIS 
// FILTER THE CODE BELOW TO GRAB AND RETURN THE DESIRED FIELDS AS NEEDED
function getStatusRecordByOrderId(order_id)
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            const serverLevel = process.env.SERVER_LEVEL;
            resolve(getStatusRecordByOrderIdAndEnv(order_id, serverLevel));
        }
        catch(error)
        {
            let message = 'An error occurred inside getStatusRecordByOrderId() : ' + error;
            reject(message);
        }
    });
}

/* This method is mainly for testing ... getStatusRecordByOrderId() should be used */
function getStatusRecordByOrderIdAndEnv(orderId, env)
{
    Logger.debug("start getStatusRecordByOrderIdAndEnv");
    return new Promise((resolve, reject) => 
    {
        try
        {
            let paramArray = new Array();

            let osr = new OrderStatusRecord();

            paramArray.push(osr.addOrderIdParam(orderId));  
            //paramArray.push(osr.addEnvParam(env));              

            Logger.debug('Getting ready to run the query ... ');
            Logger.debug('The query -> ' + OrderStatusSQL.ORDER_STATUS_SELECT_BY_ID);
            azureMsSqlDBHelper.executeQuery(paramArray, OrderStatusSQL.ORDER_STATUS_SELECT_BY_ID).then(result =>
            {

                Logger.debug('Results were successfully returned ...');
                Logger.debug(result);

                let orderStatusRecord;

                if (result.recordset.length == 0) {
                    Logger.debug('No order information exists in order_service_client for the given order_number');
                    resolve(null);
                }

                if (result.recordset.length > 1)
                {
                    throw Error('function getStatusRecordByOrderId() returned more than 1 Status record.  A serious error occurred.  Please contact the IT team.');
                }
                else
                {
                    Logger.debug('Attempting to process [ ' + result.recordsets.length + ' ] order status records ...');

                    result.recordset.forEach(row => 
                    {
                        Logger.debug('The row from recordset => ');
                        Logger.debug(row);

                        orderStatusRecord = new OrderStatusRecord(
                            row.order_id,
                            row.json,
                            row.offline_token_list,
                            row.epcot_order_number,
                            row.record_created, 
                            row.written_to_epcot,
                            row.env, 
                            row.source_details,
                            row.site,
                            row.order_type                              
                        );

                        Logger.debug('Order status record inside getStatusRecordByOrderId()');
                        Logger.debug(orderStatusRecord);
                   });

                    Logger.debug('The converted OrderStatusRecord outside the forEach loop -> ');
                    Logger.debug(orderStatusRecord);
                }

                Logger.debug('getStatusRecordByOrderId() -> order status record returned ...');
                Logger.debug(orderStatusRecord);
                resolve(orderStatusRecord);
            });     
        } 
        catch (exception) {
            console.log(exception.message);
            reject(exception);
        }
    });
}

module.exports.getStatusRecordByOrderId = getStatusRecordByOrderId;
module.exports.getStatusRecordByOrderIdAndEnv = getStatusRecordByOrderIdAndEnv;