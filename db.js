let Logger = require('./log/Logger')(__filename);
const oracledb = require('oracledb');
const serverLevel = process.env.SERVER_LEVEL;
//console.log(serverLevel);
const dbinfo = require('./config/websphere/db-info')[serverLevel];
//console.log(dbinfo);

oracledb.outFormat = oracledb.OBJECT;

async function simpleExecute(statement, binds = [], opts = {}) 
{
  let conn = null;
  try {
    conn = await getConnection();

    Logger.debug('db::simpleExecute() statement -> ' + statement);  
    Logger.debug('db::simpleExecute() binds -> ' + JSON.stringify(binds));
    Logger.debug('db::simpleExecute() opts -> ' + JSON.stringify(opts));
  
    const result = await executeQuery(conn, statement, binds, opts);
    return result;

  } catch (error) {
    console.log(error.message);
    throw Error(error);
  } finally {
    conn.close(function(err) 
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
};

function executeQuery(connect, statement, binds, opts)
{ 
  Logger.debug('db::executeQuery() conn -> ' + JSON.stringify(connect));
  Logger.debug('db::executeQuery() statement -> ' + statement);
  Logger.debug('db::executeQuery() binds -> ' + JSON.stringify(binds));
  Logger.debug('db::executeQuery() opts -> ' + JSON.stringify(opts));
  return new Promise((resolve, reject) => {
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
  })
}

function getConnection() 
{  
  return new Promise(function(resolve, reject) {
    var db_usr = dbinfo.COMMERCE_USER;    
    var db_pwd = dbinfo.COMMERCE_PWD;  // TODO : HANDLE DB PWD ENCRYPTION
    var db_url = dbinfo.COMMERCE_URL;
    
    oracledb.getConnection(
      {
        // this is teststage
        user: db_usr,
        password: db_pwd,
        connectString: db_url,
      },
      function(err, connection1) {    
        resolve(connection1);

        if (err) {
          console.error(err.message);
          reject(err);
        }
      });
  })
}

module.exports.simpleExecute = simpleExecute;