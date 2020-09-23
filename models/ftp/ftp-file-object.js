"use strict";

// Check for requirements here 
// These objects will be paired to order-status-ids in a map
class FTPFilenameObject {

    // We may want this object to hold more data (date last processed, permissions, etc.)
    constructor(FILENAME, DIRECTORY_NAME) {
        this.FILENAME = FILENAME;
        this.DIRECTORY_NAME = DIRECTORY_NAME;
    }

    getFilename() {
        return this.FILENAME;
    }

    getDirectoryName() {
        return this.DIRECTORY_NAME;
    }


    // Add any other methods here as desired
}

module.exports = FTPFilenameObject;