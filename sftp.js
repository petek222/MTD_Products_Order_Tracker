let Client = require('ssh2-sftp-client');

const Logger = require('./log/Logger')(__filename);

let sftp = null;

function connect(){
    // FILL IN CONNECTION PROMISE 
}

function getList(remoteFilePath){
    let listOfFiles = [];
    return new Promise((resolve, reject) => {
        try {
            if (sftp == null){
                connect().then(function(){
                    sftp.list(remoteFilePath).then(data =>{

                        // Uncomment the line below to see the data retrieved from the file list 
                        //console.log(data);
                
                        resolve(data);
                      }).catch(err=>{
                        console.log(err.message);
                        reject(err);
                      });
                }).catch(err=>{reject(err)});
            }
            else {
                sftp.list(remoteFilePath).then(data =>{
                    data.forEach(fileObject=>{
                        if (fileObject.type == '-'){
                            listOfFiles.push(fileObject.name);
                        }
                    });
                    resolve(listOfFiles);
                  }).catch(err=>{
                    console.log(err.message);
                    reject(err);
                  });
            }
        }
        catch (exception){
            reject(exception);
        }

    });
}

function getFile(remoteFile,localFile){
    let listOfFiles = [];
    return new Promise((resolve, reject) => {
        try {
            if (sftp == null){
                connect().then(function(){
                    sftp.fastGet(remoteFile, localFile, function (err) {
                        if (err) {
                            console.log(err.message);
                            //throw err;
                            
                           
                            reject(err);
                        } 
                        Logger.debug(`${remoteFile} has successfully download to ${localFile}!`);
                        resolve();
                    });
                }).catch(err=>{reject(err)});
            }
            else {
                sftp.fastGet(remoteFile, localFile, function (err) {
                    if (err) {
                        Logger.error(err.message);
                        reject(err);
                    } else{
                        Logger.debug(`${remoteFile} has successfully download to ${localFile}!`);
                        resolve({remoteSource: remoteFile});
                    }
                });
            }
        }
        catch (exception){
            reject(exception);
        }

    });
}

async function moveFile(remoteSourcePath,remoteDestPath){
    try {
        result = await sftp.rename(remoteSourcePath, remoteDestPath);
        return {ok: true, data: result}
    } catch (error) {
        Logger.debug(error);
        throw Error(error);
    }
}

function shutdown(){
    if (sftp != null){
        console.log("ending sftp connection");
        sftp.end();
    }
}

module.exports.connect = connect;
module.exports.shutdown = shutdown;
module.exports.getList = getList;
module.exports.getFile = getFile;
module.exports.moveFile = moveFile;