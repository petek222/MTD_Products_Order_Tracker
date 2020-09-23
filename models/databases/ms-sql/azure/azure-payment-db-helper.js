"use strict";

// CHANGE THIS
const serverLevel = process.env.SERVER_LEVEL;
//console.log(serverLevel);

const PaymentDBHelper = require('../payment-db-helper');

//const azureConfigJson = require('../../../../config/azure/db-info-azure')[serverLevel];
const paymentConfigJson = require('../../../../config/payment/payment-db-info')[serverLevel];
//console.log(azureConfigJson);


class AzurePaymentDBHelper
{
    constructor()
    {   
        this.azureDBConfig = 
        {    
            user: paymentConfigJson.PAYMENT_DB_USERNAME,
            database: paymentConfigJson.PAYMENT_DB_NAME,
            password: paymentConfigJson.PAYMENT_DB_PASSWORD,
            server: paymentConfigJson.PAYMENT_DB_SERVER_NAME,
            options: {
                encrypt: true // Use this if you're on Windows Azure
            }
        };
    }

    getInstance()
    {
        return new PaymentDBHelper(this.azureDBConfig);
    }
}

module.exports = AzurePaymentDBHelper;