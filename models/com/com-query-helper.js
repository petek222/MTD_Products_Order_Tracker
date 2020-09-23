"use strict";

const Logger = require('../../log/Logger')(__filename);


// COM History type queries 
function getHistoryOrderHeaderSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBBWCPP@CORP400 order_history_header where BWCVNB = " + com_order_number + " and BWAENB =" + com_company_number + " and BWDCCD =" + internal_header_type);
}

function getHistoryLineItemSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBGGCPP@CORP400 orderlineitem where GGCVNB = " + com_order_number + "and GGAENB = " + com_company_number + " and GGDCCD = " + internal_header_type);
}

function getHistoryOrderDetailSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBDRREP@CORP400 where  DRCVNB = " + com_order_number + " and DRAENB = " + com_company_number + " and DRDCCD = " + internal_header_type);
}

function getHistoryShipmentHeaderSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBDHREP@CORP400 where DHCVNB = " + com_order_number + " and DHAENB = " + com_company_number + "and DHDCCD = " + internal_header_type);
}


// --------------------------------------------------------------------------------------------


// COM Offline type queries
// ************
// These, unlike other COM queries, are keyed off token number, rather than com order number

function getOfflineOrderHeaderSql(offline_token_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBG8CPP@CORP400 where G8AA74 =  '" + offline_token_number + "' and G8AENB = " + com_company_number + "and G8DCCD = " + internal_header_type);
}

function getOfflineOrderDetailSql(offline_token_number, com_company_number, internal_header_type) {

    return ("select * from AMFLIBF.MBG9CPP@CORP400 where G9AA74 =  " + offline_token_number + "and G9AENB = " + com_company_number);
}

// Shipment Header should NOT be obtained for offline by token number 
// function getOfflineShipmentHeaderSql(com_order_number, com_company_number, internal_header_type) {

//     Logger.info('COM_ORDER_NUMBER: ' + com_order_number);
//     Logger.info('COM_COMPANY_NUMBER: ' + com_company_number);
//     Logger.info('INTERNAL_HEADER_TYPE: ' + internal_header_type);

//     return ("select * from AMFLIBF.OSAAREP@CORP400 where MXCVNB =  " + com_order_number + "and MXAENB = " + com_company_number + "and MXDCCD = " + internal_header_type);
// }


// --------------------------------------------------------------------------------------------


// COM Open type queries 
function getOpenOrderHeaderSql(com_order_number, com_company_number, internal_header_type) {
   
    Logger.info(com_order_number);
    Logger.info(com_company_number);
    Logger.info(internal_header_type);

    return ("select * from AMFLIBF.MBC6REP@CORP400 where C6CVNB =  " + com_order_number + "and C6AENB = " + com_company_number + "and C6DCCD = " + internal_header_type);
}

function getOpenOrderDetailSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBCDREP@CORP400 where CDCVNB =  " + com_order_number + "and CDAENB = " + com_company_number + "and CDDCCD = " + internal_header_type);
}

function getOpenShipmentHeaderSql(com_order_number, com_company_number, internal_header_type) {
    return ("select * from AMFLIBF.MBDHREP@CORP400 where DHCVNB =  " + com_order_number + "and DHAENB = " + com_company_number + "and DHDCCD = " + internal_header_type);
}


module.exports.getHistoryLineItemSql = getHistoryLineItemSql;
module.exports.getHistoryOrderDetailSql = getHistoryOrderDetailSql;
module.exports.getHistoryOrderHeaderSql = getHistoryOrderHeaderSql;
module.exports.getHistoryShipmentHeaderSql = getHistoryShipmentHeaderSql;
module.exports.getOfflineOrderHeaderSql = getOfflineOrderHeaderSql;
module.exports.getOfflineOrderDetailSql = getOfflineOrderDetailSql;
module.exports.getOpenOrderDetailSql = getOpenOrderDetailSql;
module.exports.getOpenOrderHeaderSql = getOpenOrderHeaderSql;
module.exports.getOpenShipmentHeaderSql = getOpenShipmentHeaderSql;