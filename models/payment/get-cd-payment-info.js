"use strict";

const mssql = require('mssql');
const Logger = require('../../log/Logger')(__filename);

//const AzureMsSqlDBHelper = require('../databases/ms-sql/azure/azure-ms-sql-db-helper');
const AzurePaymentDBHelper = require('../databases/ms-sql/azure/azure-payment-db-helper');
const PaymentServiceQueries = require('../../config/payment/sql');

const paymentDBHelper = new AzurePaymentDBHelper().getInstance();
const msSqlInputParam = require('../databases/ms-sql/ms-sql-input-param');


// Decouple base version from env version?

function getChaseAuthorizationVwInfo(orderNumber) {
    
    return new Promise((resolve, reject) => {

        let updatedDate = new Date();

        let paramArray = new Array();

        let paramObject = new msSqlInputParam('OrderNumber', mssql.VarChar, orderNumber); // data type could be different  

        paramArray.push(paramObject);
        
        let sql = PaymentServiceQueries.SELECT_AUTHORIZATION_VW;
        Logger.debug('getChaseAuthorizationVwInfo() sql: ' + sql);
        Logger.debug('getChaseAuthorizationVwInfo orderNumber: ' + orderNumber);

        try {
            paymentDBHelper.executeQuery(paramArray, sql).then(queryResults => {
                resolve(queryResults);
            })
        }
        catch (error) {
            reject(error);
        }
    });
}

// Change to use paramObject
function getCreditCardPaymentVwInfo(orderNumber) {
    
    return new Promise((resolve, reject) => {

        let updatedDate = new Date();

        let paramArray = new Array();

        let paramObject = new msSqlInputParam('OrderNumber', mssql.VarChar, orderNumber); // data type could be different  

        paramArray.push(paramObject);
        
        let sql = PaymentServiceQueries.SELECT_CREDIT_CARD_PAYMENT_VW;
        Logger.debug('getChaseAuthorizationVwInfo() sql: ' + sql);
        Logger.debug('getChaseAuthorizationVwInfo orderNumber: ' + orderNumber);

        try {
            paymentDBHelper.executeQuery(paramArray, sql).then(queryResults => {
                resolve(queryResults);
            })
        }
        catch (error) {
            reject(error);
        }
    });
}

// change to use paramObject
function getConsumerOrderStatus(orderNumber) {
    
    return new Promise((resolve, reject) => {

        let updatedDate = new Date();

        let paramArray = new Array();

        let paramObject = new msSqlInputParam('OrderNumber', mssql.VarChar, orderNumber); // data type could be different  

        paramArray.push(paramObject);
        
        let sql = PaymentServiceQueries.SELECT_CONSUMER_ORDER_STATUS;
        Logger.debug('getChaseAuthorizationVwInfo() sql: ' + sql);
        Logger.debug('getChaseAuthorizationVwInfo orderNumber: ' + orderNumber);

        try {
            paymentDBHelper.executeQuery(paramArray, sql).then(queryResults => {
                resolve(queryResults);
            })
        }
        catch (error) {
            reject(error);
        }
    });
}


module.exports.getChaseAuthorizationVwInfo = getChaseAuthorizationVwInfo;
module.exports.getCreditCardPaymentVwInfo = getCreditCardPaymentVwInfo;
module.exports.getConsumerOrderStatus = getConsumerOrderStatus;