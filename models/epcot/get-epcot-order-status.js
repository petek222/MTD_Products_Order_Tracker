"use strict";

const Logger = require('../../log/Logger')(__filename);

const EpcotOracleDBHelper = require('../databases/oracle/epcot/epcot-oracle-db-helper');
const EpcotQueries = require('../../config/epcot/epcot-sql');
let EpcotOrderStatusInfo= require('../epcot/epcot-order-status-info');

const epcotOracleDBHelper = new EpcotOracleDBHelper().getInstance();
// No need for special input param class since oracle (not mssql)


// Decouple base version from env version?

function getOrderStatusInfoMap() {

    return new Promise((resolve, reject) => {

        let sql = EpcotQueries.SELECT_ORDER_STATUS_DATA;
        Logger.debug('loadOrderStatusInfoMap() sql: ' + sql);

        // Check this call (2nd param ?)
        epcotOracleDBHelper.execute(sql).then(results => {

            Logger.debug('loadOrderStatusInfoMap() query results: ');
            Logger.debug(results);

            // Check this conditional
            if (results.rows.length == 0) {
                Logger.error('A series database error has occurred. All Epcot order status information is missing');
                resolve(null);
            }
            else {

                let orderStatusMap = new Map();

                // Check the loop 
                Logger.debug('Processing ' + results.rows.length + 'results');
                results.rows.forEach(row => {

                    let orderStatusId = row['ORDER_STATUS_ID'];
                    let desc = row['DESCRIPTION'];
                    let comStatus = row['SHOW_COM_STATUS'];
                    let comHolds = row['SHOW_COM_HOLDS'];
                    let customerDesc = row['CUSTOMER_DESCRIPTION'];

                    Logger.debug('Description: ' + desc);
                    Logger.debug('COM Status: ' + comStatus);
                    Logger.debug('COM Holds: ' + comHolds);
                    Logger.debug('Customer Description: ' + customerDesc);


                    let object = new EpcotOrderStatusInfo(orderStatusId, desc, comStatus, comHolds, customerDesc);

                    orderStatusMap.set(orderStatusId, object);

                });

                Logger.debug('Generated orderStatusMap: ' + orderStatusMap);
                resolve(orderStatusMap);
            }
        })
        .catch(function(err) {
            Logger.error(err);
            reject(err);
        })
    });
}

function getEpcotOrderStatusInformation(order_number) {

    return new Promise((resolve, reject) => {

        getOrderStatusInfoMap().then(orderStatusMap => { 
            
        let origSql = EpcotQueries.SELECT_ORDER_STATUS_ID_BY_ORIGINAL_ORDER_NUMBER;
        let epcotSql = EpcotQueries.SELECT_ORDER_STATUS_ID_BY_EPCOT_ORDER_NUMBER;
        Logger.debug('getEpcotOrderStatusInformation origSql: ' + origSql);
        Logger.debug('getEpcotOrderStatusInformation epcotSql: ' + epcotSql);

        epcotOracleDBHelper.execute(origSql, {Order_number : order_number}).then(results => {

            // Check this conditional: THIS NEEDS TO BE CHANGED TO CHECK BY EPCOT ORDER NUMBER TOO
            // Since it may have been placed in Epcot directly (order num begins with 'CD')
            // Create some flag to differentiate the two
            if (results.rows.length == 0) {
                Logger.debug('No Epcot Status Info exists for the given original_order_number');

                epcotOracleDBHelper.execute(epcotSql, {Order_number : order_number}).then(epcotResults => {

                    if (epcotResults.rows.length == 0) {
                        Logger.debug('No Status Info exists for the given order_number in any context');
                        resolve(null);
                    }

                    else {

                        Logger.debug('orderStatusMap: ' + orderStatusMap);
                        Logger.debug('results: ' + epcotResults);

                        let orderStatusId = epcotResults.rows[0]['ORDER_STATUS_ID'];
                        let orderStatusInfo = orderStatusMap.get(orderStatusId);

                        orderStatusInfo['PLACED_IN_EPCOT'] = true;

                        resolve(orderStatusInfo);

                    }
                })

            }

            else {
            
                Logger.debug('orderStatusMap: ' + orderStatusMap);
                Logger.debug('results: ' + results);

                let orderStatusId = results.rows[0]['ORDER_STATUS_ID'];
                let orderStatusInfo = orderStatusMap.get(orderStatusId);

                orderStatusInfo['PLACED_IN_EPCOT'] = false;

                resolve(orderStatusInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    })
    .catch(err => {
        console.log(err);
        reject(err);
    });
    });
}

module.exports.getEpcotOrderStatusInformation = getEpcotOrderStatusInformation;
module.exports.getOrderStatusInfoMap = getOrderStatusInfoMap;
