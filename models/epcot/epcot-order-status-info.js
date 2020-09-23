"use strict";

// Check for requirements here 
// These objects will be paired to order-status-ids in a map
class EpcotOrderStatusInfo {

    constructor(ORDER_STATUS_ID, DESC, SHOW_COM_STATUS, SHOW_COM_HOLDS, CUSTOMER_DESC) {
        this.ORDER_STATUS_ID = ORDER_STATUS_ID;
        this.DESC = DESC;
        this.SHOW_COM_STATUS = SHOW_COM_STATUS;
        this.SHOW_COM_HOLDS = SHOW_COM_HOLDS;
        this.CUSTOMER_DESC = CUSTOMER_DESC;
    }

    getOrderStatusID() {
        return this.ORDER_STATUS_ID;
    }

    getDescription() {
        return this.DESC;
    }

    getCOMStatus() {
        return this.SHOW_COM_STATUS;
    }

    getCOMHolds() {
        return this.SHOW_COM_HOLDS;
    }

    getCustomerDescription() {
        return this.CUSTOMER_DESC;
    }

    // Add any other methods here as desired
}

module.exports = EpcotOrderStatusInfo;