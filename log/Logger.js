"use strict"

const winston = require('winston')

var logger = winston.createLogger({
    transports: [
        new (winston.transports.File) ({
            filename: 'logfile.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            level: process.env.LOGGER_LEVEL,
            timestamp: true,
            json: false
        }),
        new (winston.transports.Console) ({
            level: process.env.LOGGER_LEVEL,
            prettyPrint: true,
            colorize: true,
            timestamp: true,

            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple()
              )
        })
    ]
})  

module.exports = function(fileName) {    
    var customlogger = {
        error: function(text) {
            logger.error(fileName + ': ' + JSON.stringify(text, null, 4));
        },
        warn: function(text) {
            logger.warn(fileName + ': ' + JSON.stringify(text, null, 4));
        },
        info: function(text) {
            logger.info(fileName + ': ' + JSON.stringify(text, null, 4));
        },
        debug: function(text) {
            logger.debug(fileName + ': ' + JSON.stringify(text, null, 4));
        },
        verbose: function(text) {
            logger.verbose(fileName + ': ' + JSON.stringify(text, null, 4));
        }        ,
        silly: function(text) {
            logger.silly(fileName + ': ' + JSON.stringify(text, null, 4));
        }
    }

    return customlogger;
}