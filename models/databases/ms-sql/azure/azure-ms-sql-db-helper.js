"use strict";

// CHANGE THIS
const serverLevel = process.env.SERVER_LEVEL;
//console.log(serverLevel);

const MsSqlDBHelper = require('../ms-sql-db-helper');
const azureConfigJson = require('../../../../config/azure/db-info-azure')[serverLevel];
//console.log(azureConfigJson);


class AzureMsSqlDBHelper 
{
    constructor()
    {
        
        console.log('Server Level: ' + serverLevel);
        this.azureDBConfig = 
        {    
            user: azureConfigJson.AZURE_MMSERVICES_DB_USERNAME,
            database: azureConfigJson.AZURE_MMSERVICES_DB_NAME,
            password: azureConfigJson.AZURE_MMSERVICES_DB_PASSWORD,
            server: azureConfigJson.AZURE_MMSERVICES_DB_SERVER_NAME,
            options: {
                encrypt: true // Use this if you're on Windows Azure
            }
        };
    }

    getInstance()
    {
        return new MsSqlDBHelper(this.azureDBConfig);
    }
}

module.exports = AzureMsSqlDBHelper;