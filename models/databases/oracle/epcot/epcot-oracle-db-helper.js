"use strict";

const OracleDBHelper = require('../oracle-db-helper');

const serverLevel = process.env.SERVER_LEVEL;
const epcotdbinfo = require('../../../../config/epcot/db-info')[serverLevel];

class EpcotOracleDBHelper 
{
    constructor()
    {          
        this.dbUser = epcotdbinfo.EPCOT_USER;    
        this.dbPassword = epcotdbinfo.EPCOT_PWD;  
        this.dbUrl = epcotdbinfo.EPCOT_URL;
    }

    getInstance()
    {
        return new OracleDBHelper(this.dbUser, this.dbPassword, this.dbUrl);
    }
}

module.exports = EpcotOracleDBHelper;