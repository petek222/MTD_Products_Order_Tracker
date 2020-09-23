"use strict";

let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-datetime'));

let Logger = require('../log/Logger')(__filename);
let remoteFtpHelper = require('../models/ftp/remote-ftp-helper');

describe('Remote FTP Server helper test', function() {

    it('Testing the remote FTP helper', async () => {

        remoteFtpHelper.executeServerCommand();

        // Fill in as desired 
    
    });

});
