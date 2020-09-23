"use strict";

const sftp = require('../../sftp');
const Logger = require('../../log/Logger')(__filename);
const fs = require('fs');
const path = require('path');
const xmlConverter = require('../../util/xml-converter');
const rimraf = require('rimraf');
const fileHelper = require('../../util/file-helper');


// -----------------------------------------------------------------
// THIS IS DEPRECATED: FUNCTIONALITY DOWNLOADS XML FILES, TOO HEAVY:
// CODE STILL HERE IF YOU WANT TO EVER USE THIS DOWNLOADING FUNCTIONALITY
//
// -----------------------------------------------------------------



// ------------------------------------------------------------------
// This is probably far too inefficient, but its worth a shot
// What are we going to be looking at within the FTP server? Like how many XMLs will we look at at a time ?
function getFTPFileListByPath(path, importsFolder) {

    return new Promise((resolve, reject) => {

        let fileCount = 0;

        sftp.getList(path).then(result => {

            result.forEach(element => {

                if (element.type == '-') {

                    fileCount++;

                    let remoteFilename = path + "/" + element.name;
                    let localFilename = importsFolder + element.name;

                    sftp.getFile(remoteFilename, localFilename).then(res => {

                        // do anything else with the data as needed here 
                        resolve();
                    })
                    .catch(err => {
                        Logger.error(err);
                        reject(err);
                    });
                }
            });

            // This block ensures execution if no XML files exist in specified ftp directory / path 
            if (fileCount == 0) {
                resolve(null);
            }

        })
        .catch(err => {
            Logger.error(err);
            reject(err);
        });
    });
}


// This reads in the Order Numbers for each xml file in the 'imports/ftp-imports/'
function getOrderNumbersFromImports(dirname) {

    return new Promise((resolve, reject) => {
        
    // This Array will be filled with all the order-numbers from the ftp-server xml files in the specified path / sftp directory
    let orderNumberArray = new Array();

    fs.readdir(dirname, (err, files) => {

        if (err) {
            Logger.error('Could not find imports directory');
            reject (err);
            return;
        }

        let filePromises = new Array();

        files.forEach(function(filename) {

            // All the files are in here in 'content' each time, but their behavior is bizarre upon attempted access
            filePromises.push(xmlConverter.readLocalXMLFileAsJson(dirname + filename));

            })

            Promise.all(filePromises).then(results => {

                results.forEach(result => {

                    if (Array.isArray(result['orders']['order'])) {

                        // need to call array version that processess
                        let subArray = orderArrayHelper(result['orders']['order']);

                        orderNumberArray = orderNumberArray.concat(subArray);
                    }

                    else {
                        let orderNum = result['orders']['order']['_attributes']['order-no'];
                        orderNumberArray.push(orderNum);
                    }

                })
                Logger.debug('Filled orderNumberArray: ' + orderNumberArray);
                resolve(orderNumberArray);
            })
            .catch(err => {
                Logger.error(err);
                reject(err);
            })
        })
    });
}


// Clears imports directory of all files 
async function clearFTPImports(dirname) {
    
    await rimraf(dirname + '*', function () { 
        console.log('ftp-imports directory deletion: complete');
    });

    // return new Promise ((resolve, reject) => {

    //     fs.readdir(dirname, (err, files) => {

    //         if (err) {
    //             Logger.error(err);
    //             reject(err);
    //         }

    //         for (const file of files) {
    //             fs.unlink(path.join(dirname, file), err => {

    //                 if (err) {
    //                     Logger.error(err);
    //                     reject(err);
    //                 }

    //             });
    //         }
    //         resolve();
    //     })
    // });
}


// Function to help generate order array for multi-order xml files 
function orderArrayHelper(orderArray) {

    let orderSubArray = new Array();

    orderArray.forEach(element => {

        let orderNum = element['_attributes']['order-no'];
        orderSubArray.push(orderNum);
    });

    return orderSubArray;
}


// Checks the created orderNumberArray for the presence of a specified order_number
function checkFTPForOrder(order_number, orderNumberArray) {
    
    return (orderNumberArray.includes(order_number));
}



module.exports.getFTPFileListByPath = getFTPFileListByPath;
module.exports.getOrderNumbersFromImports = getOrderNumbersFromImports;
module.exports.clearFTPImports = clearFTPImports;
module.exports.checkFTPForOrder = checkFTPForOrder;