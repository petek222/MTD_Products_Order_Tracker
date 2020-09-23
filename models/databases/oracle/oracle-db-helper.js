"use strict";

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

let Logger = require('../../../log/Logger')(__filename);

class OracleDBHelper 
{
    constructor(user, password, url)
    {
        this.db_usr = user;    
        this.db_pwd = password;  
        this.db_url = url;                  
    }

    getConnection(dbUser, dbPassword, dbUrl) 
    {  
        return new Promise((resolve, reject) =>
        {
            oracledb.getConnection(
            {
                user: dbUser,
                password: dbPassword,
                connectString: dbUrl,
            },
            function(err, connection1) 
            {
                Logger.debug('Get Connection - connection resolved -> ');
                Logger.debug(connection1);
                resolve(connection1);
        
                if (err) 
                {
                    console.error(err.message);
                    reject(err);
                }
            });
        });
    }

    execute(statement, binds = [], opts = {}) 
    {
        return new Promise((resolve, reject) =>
        {
            let conn;
            (async () =>
            {
                try 
                {
                    conn = await this.getConnection(this.db_usr, this.db_pwd, this.db_url);

                    Logger.debug('db::simpleExecute() statement -> ' + statement);  
                    Logger.debug('db::simpleExecute() binds -> ' + JSON.stringify(binds));
                    Logger.debug('db::simpleExecute() opts -> ' + JSON.stringify(opts));
                
                    const result = await this.performExecute(conn, statement, binds, opts);
                    resolve(result);
                } 
                catch(error) 
                {
                    console.log(error.message);
                    reject(error);
                } 
            })()
        });
    }

    performExecute(connect, statement, binds, opts)
    { 
        Logger.debug('db::performExecute() conn -> ' + JSON.stringify(connect));
        Logger.debug('db::performExecute() statement -> ' + statement);
        Logger.debug('db::performExecute() binds -> ' + JSON.stringify(binds));
        Logger.debug('db::performExecute() opts -> ' + JSON.stringify(opts));
        return new Promise((resolve, reject) => 
        {
            try 
            {
                Logger.debug('----------- Before connect.execute() ----------------');
                const result =  connect.execute(statement, binds, opts);
                Logger.debug('----------- After connect.execute() ----------------');
                
                resolve(result);
            } 
            catch (err) 
            {
                reject(err);       
            }
            finally
            {
                closeConnection(conn);
            }
        });
    }

    closeConnection(conn)
    {
        conn.close(err =>
        {
            if (err) 
            {
                console.log(err);
            }
            {
                console.log("connection closed!");
            }
        });
    }
}

module.exports = OracleDBHelper;