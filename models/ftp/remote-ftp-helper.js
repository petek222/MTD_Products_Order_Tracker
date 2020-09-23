"use strict";

const sftp = require('../../sftp');
const Logger = require('../../log/Logger')(__filename);
const fs = require('fs');
const path = require('path');
const fileHelper = require('../../util/file-helper');
let fileObj = require('./ftp-file-object');
let FTP = require('../../config/ftp/ftp-server');


// This function will generate arrays by file path
// NOTE: May also want modification date (see how)
// May also want to be able to select desired directory (staging, temp, prod, etc.) from UI
function getFTPFilenameListByPath(path) {

    return new Promise((resolve, reject) => {

        //let fileNameArray = [];
        let filenameMap = new Map();
        let fileCount = 0;

        sftp.getList(path).then(result => {

            result.forEach(element => {

                if (element.type == '-' || !element.type) {

                    let fileObject;
                    
                    fileCount++;
                    //fileNameArray.push(element.name);
                    if (element.name) {
                        fileObject = new fileObj(element.name, path);
                        filenameMap.set(element.name, fileObject);
                    }
                    else {
                        fileObject = new fileObj(element, path)
                        filenameMap.set(element, fileObj);
                    }
                }
            });

            // This block ensures execution if no XML files exist in specified ftp directory / path 
            if (fileCount == 0) {
                resolve(null);
            }

            resolve(filenameMap);

        })
        .catch(err => {
            Logger.error(err);
            reject(err);
        });
    });
}


function checkFTPforFilename(filename, filenameArray) {
    return (filenameArray.includes(filename)); // We are probably going to want to do more than this 
}

function getFTPFileData(filename, filenameMap) {

    let fileObject = filenameMap.get(filename);
    let isProcessed = fileObject.DIRECTORY_NAME;

    return (isProcessed.includes('processed')); // should return correct boolean as desired 
}



module.exports.getFTPFilenameListByPath = getFTPFilenameListByPath;
module.exports.checkFTPforFilename = checkFTPforFilename;
module.exports.getFTPFileData = getFTPFileData;