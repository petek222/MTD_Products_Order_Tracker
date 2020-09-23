"use strict";

const sql = require ('mssql');

class PaymentDBHelper 
{
    constructor(dbConfig)
    {
        this.dbConfig = dbConfig;
        this.user = dbConfig.user;      
        this.database = dbConfig.database;                   
        this.password = dbConfig.password;                    
        this.server = dbConfig.server;                   
        this.options = dbConfig.options; 
    }

    getConnection()
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                var dbConn = new sql.ConnectionPool(this.dbConfig);

                resolve(dbConn);
            }
            catch(error)
            {
                reject(error);
            }
        });
    }

    executeQuery(MsSqlInputParamList, queryText)
    {
        return new Promise((resolve, reject) => 
        {
            (async() =>
            {
                try 
                {
                    var dbConn = await this.getConnection();
                        
                    dbConn.connect().then(() => 
                    {
                        var request = new sql.Request(dbConn);

                        // append the list to the request ...
                        Object.values(MsSqlInputParamList).
                        forEach(param =>
                        {
                            request.input(param.columnName, param.columnType, param.columnValue);
                        });
                        
                        request.query(queryText, (err, result) => 
                        {
                            if (err) 
                            {
                                console.log(err);
                                dbConn.close();
                                reject(err);
                            }
                
                            dbConn.close();
                            resolve(result);
                        });
                    }).catch(err => 
                    {
                        console.log(err);
                        dbConn.close();
                        reject(err);
                    });
                } 
                catch (exception) 
                {
                    console.log(exception.message);
                    reject(exception);
                }
            })();
        });
    }
}

module.exports = PaymentDBHelper;