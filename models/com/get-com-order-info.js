"use strict";

const Logger = require('../../log/Logger')(__filename);

const EpcotOracleDBHelper = require('../databases/oracle/epcot/epcot-oracle-db-helper');
const COMQueries = require('../../config/com/com-sql');
const queryHelper = require('./com-query-helper');

// connecting to same epcot db: no need for a new 'com' helper
const epcotOracleDBHelper = new EpcotOracleDBHelper().getInstance();

// This is probably where a controller will be helpful: since we are gonna have multiple functions for multiple table calls, we will
// probably want to centralize the flow of the function calling in a controller. (It can also be responsible for sending the last of 
// the data back to format in a giant JSON object)
//
// THE FIELDS OBTAINED BY THE GETTERS NEED TO BE GREATLY TRIMMED DOWN, SPECIFICALLY THE COM GETTERS (all just select * for the moment)
//
// These all exist in 3 environment types: Open, History, and Offline Load 

function getEpcotOrderDetails (original_order_number) {

    return new Promise ((resolve, reject) => {

        let sql = COMQueries.GET_EPCOT_ORDER_DETAILS;
        Logger.info('getEpcotOrderDetails sql: ' + sql);
        Logger.info(original_order_number);

        epcotOracleDBHelper.execute(sql, {Original_order_number : original_order_number}).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                console.log('No order information exists in epcot for the given original_order_number');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);
                            
                let resultEpcotInfo = results.rows[0];

                resolve(resultEpcotInfo); // Check resolution statement 
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

// This function currently grabs everything, but we really want the COM order number(s) 
function getCOMOrderBySalesOrderId(sales_order_id) {

    return new Promise((resolve, reject) => {

        let sql = COMQueries.GET_COM_ORDER_BY_SALES_ORDER_ID;
        Logger.debug('getCOMOrderNumbersBySalesOrderId sql: ' + sql);

        epcotOracleDBHelper.execute(sql, {Sales_order_id : sales_order_id}).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                console.log('No COM Order(s) exist for the given sales_order_id');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);

                let resultCOMInfo = results.rows[0];

                resolve(resultCOMInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}


// Params here are obtained from getEpcotOrderDetails()
// This is only for COM history: no need for 'env_type' parameter
function getLineItemByCOMOrderNumber(env_type, com_order_number, com_company_number, internal_header_type) {

    return new Promise ((resolve, reject) => {

        // Line Item Information should only exist/be retrieved for 'history' env 
        if (env_type != 'history') {
            console.log('HERE');
            resolve(null);
        }

        else {

        let sql = queryHelper.getHistoryLineItemSql(com_order_number, com_company_number, internal_header_type);
        Logger.debug('getOrderHeader() sql: ' + sql);

        epcotOracleDBHelper.execute(sql).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                Logger.debug('No line item information exists for the given com_order_number');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);

                let lineItemInfo = results.rows[0];

                resolve(lineItemInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    }
    });
}


// Params here are obtained from getEpcotOrderDetails()
function getOrderHeaderByCOMOrderNumber(env_type, com_offline_token, com_order_number, com_company_number, internal_header_type) {

    return new Promise ((resolve, reject) => {

        let sql;
        let type = env_type.toLowerCase();

        if (type == 'history') {
            sql = queryHelper.getHistoryOrderHeaderSql(com_order_number, com_company_number, internal_header_type);
        }
        else if (type == 'open') {
            sql = queryHelper.getOpenOrderHeaderSql(com_order_number, com_company_number, internal_header_type);
        }
        
        else if (type == 'offline') {
            console.log('GRABBING OFFLINE SQL');
            sql = queryHelper.getOfflineOrderHeaderSql(com_offline_token, com_company_number, internal_header_type);
        }
    
        Logger.debug('getOrderHeader() sql: ' + sql);

        epcotOracleDBHelper.execute(sql).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                Logger.debug('No order header information com_order_number');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);

                let orderHeaderInfo = results.rows[0];

                resolve(orderHeaderInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getOrderDetailByCOMOrderNumber(env_type, com_offline_token, com_order_number, com_company_number, internal_header_type) {

    return new Promise ((resolve, reject) => {

        let sql;
        let type = env_type.toLowerCase();

        if (type == 'history') {
            sql = queryHelper.getHistoryOrderDetailSql(com_order_number, com_company_number, internal_header_type);
        }
        else if (type == 'open') {
            sql = queryHelper.getOpenOrderDetailSql(com_order_number, com_company_number, internal_header_type);
        }
        else if (type == 'offline') {
            sql = queryHelper.getOfflineOrderDetailSql(com_offline_token, com_company_number, internal_header_type);
        }

        Logger.debug('getOrderHeader() sql: ' + sql);

        epcotOracleDBHelper.execute(sql).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                Logger.debug('No order detail information exists for the given com_order_number');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);

                let lineItemInfo = results.rows[0];

                resolve(lineItemInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

function getShipmentHeaderByCOMOrderNumber(env_type, com_offline_token, com_order_number, com_company_number, internal_header_type) {

    return new Promise ((resolve, reject) => {

        let sql;
        let type = env_type.toLowerCase();

        if (type == 'history') {
            sql = queryHelper.getHistoryShipmentHeaderSql(com_order_number, com_company_number, internal_header_type);
        }
        else if (type == "open") {
            sql = queryHelper.getOpenShipmentHeaderSql(com_order_number, com_company_number, internal_header_type);
        }
        else if (type == 'offline') {
            resolve();
            // nothing to do: Offline Order Detail should never be obtained (according to COM excel sheet)
        }

        if (type != 'offline') {

        Logger.debug('getOrderHeader() sql: ' + sql);

        epcotOracleDBHelper.execute(sql).then(results => {

            // Check conditional
            if (results.rows.length == 0) {
                Logger.debug('No shipment header information exists for the given com_order_number');
                resolve(null);
            }

            else {
                Logger.debug('Results: ' + results);

                let lineItemInfo = results.rows[0];

                resolve(lineItemInfo);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    }
    });
}


module.exports.getEpcotOrderDetails = getEpcotOrderDetails;
module.exports.getCOMOrderBySalesOrderId  = getCOMOrderBySalesOrderId;
module.exports.getOrderHeaderByCOMOrderNumber = getOrderHeaderByCOMOrderNumber;
module.exports.getLineItemByCOMOrderNumber = getLineItemByCOMOrderNumber;
module.exports.getOrderDetailByCOMOrderNumber = getOrderDetailByCOMOrderNumber;
module.exports.getShipmentHeaderByCOMOrderNumber = getShipmentHeaderByCOMOrderNumber;