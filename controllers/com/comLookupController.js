const Logger = require('../../log/Logger')(__filename);
const serverLevel = process.env.SERVER_LEVEL;
const settle = require('promise-settle');
const route = require('../../routes/orderLookup');
const comOrderHelper = require('../../models/com/get-com-order-info');

// These are object initializers that can be filled in later once we know what we want from each table within the COM section of the service 
let comJSON = {};
let comKey = 'COM Data';
comJSON[comKey] = []; // We can then push the data as desired onto this array within the big comJSON object 

// EPCOT GETTER NEEDS TO BE CHECKED/UPDATED
//
// This is the first function in the chain: takes an order_number, and gives us what we need to call down the COM chain
function getCOMDataFromOriginalOrderNumber(order_number, env) {

    console.log('processing COM data for ' + env + ': ');

    return new Promise ((resolve, reject) => {

        comOrderHelper.getEpcotOrderDetails(order_number).then(results => {

            Logger.debug('EpcotOrderDetails from COM: ');
            Logger.debug(results);

            let epcotDataResults = results;

            console.log('RESULTS: ');
            console.log(epcotDataResults);

            if (!epcotDataResults) {
                console.log('RES');
                resolve(null);
            }

            // This 'else' block prevents those COM errors from before 
            else {

            let sales_order_id = epcotDataResults['SALES_ORDER_ID'];
            let com_company_number = epcotDataResults['COM_COMPANY_NUMBER'];
            let internal_header_type = epcotDataResults['INTERNAL_HEADER_TYPE'];

            let order_status_id = epcotDataResults['ORDER_STATUS_ID']; // This corresponds to the status map made in the epcotStatus section ?


            resolve(comOrderNumbers(sales_order_id, com_company_number, internal_header_type, env)); 

            }

        })
        .catch(err => {
            console.log('HERE');
            Logger.error(err);
            reject(err);
        })
    });
}

// Intermediary controller grabs com_order_number by sales_order_id
function comOrderNumbers(sales_order_id, com_company_number, internal_header_type, env) {

    console.log('comOrderNumbers...');

    return new Promise((resolve, reject) => {

        comOrderHelper.getCOMOrderBySalesOrderId(sales_order_id).then(results => {

            Logger.debug('Results: ');
            Logger.debug(results);

            let comOrderData = results;
            Logger.info('EPCOT RES');
            Logger.info(results);
            let com_order_number = comOrderData['COM_QUOTE_ORDER_NUMBER'];
            let com_offline_token = comOrderData['OFFLINE_TOKEN_COM'];

            // NOTE: COM_ORDER_NUMBER HERE IS NULL. MAKE SURE WE ARE CHECKING FOR THIS SO WE DONT ERROR OUT VIA ORACLE SQL ERROR 

            // In here we can again fill up our JSON object as we want to with result data
            resolve(comData(com_offline_token, com_order_number, com_company_number, internal_header_type, env));

        })
    });
}

// Large controller function calls to each helper and fetches necessary COM data
// rememeber we are going to want to call this for offline, open, and history, so probably make env another param
async function comData(com_offline_token, com_order_number, com_company_number, internal_header_type, env) {

    var comDataObject = new Object();

    // CASE OF ENV IS IMPORTANT 
    // CHECK THIS COM CONDITIONAL
    if ((com_order_number !== null && env != 'offline') || (com_offline_token !== null && env == 'offline')) {

        Logger.debug('comData getter params: ');
        Logger.debug(com_order_number);
        Logger.debug(com_company_number);
        Logger.debug(internal_header_type);

        // Function to get orderHeader COM information
        let headerResults = await comOrderHelper.getOrderHeaderByCOMOrderNumber(env, com_offline_token, com_order_number, com_company_number, internal_header_type);

            console.log('Order Header...');
            Logger.debug('Order Header Results: ');
            Logger.debug(headerResults);
            comDataObject["orderHeader"] = headerResults;


        // Function to get lineItem COM information
        // THIS IS NOT POPPING UP IN THE JSON?
        let lineItemResults = await comOrderHelper.getLineItemByCOMOrderNumber(env, com_order_number, com_company_number, internal_header_type);
        
            console.log('Line Item...');
            Logger.debug('Line Item Results: ');
            Logger.debug(lineItemResults);
            comDataObject["lineItem"] = lineItemResults;

        // Function to get orderDetail COM information
        let detailResults = await comOrderHelper.getOrderDetailByCOMOrderNumber(env, com_offline_token, com_order_number, com_company_number, internal_header_type);

            console.log('Order Detail...');
            Logger.debug('detail Results ');
            Logger.debug(detailResults);
            comDataObject["orderDetail"] = detailResults;


        // Function to get shipmentHeader COM information
        let shipmentResults = await comOrderHelper.getShipmentHeaderByCOMOrderNumber(env, com_offline_token, com_order_number, com_company_number, internal_header_type);

            console.log('Shipment Header...');
            Logger.debug('Shipment Header: ');
            Logger.debug(shipmentResults);
            comDataObject["shipmentHeader"] = shipmentResults;

        Logger.debug(comDataObject);
        Logger.debug('Returned Data Object');

    }

    else {
        comDataObject = null;
    }

    return comDataObject;

}

module.exports.getCOMDataFromOriginalOrderNumber = getCOMDataFromOriginalOrderNumber;
