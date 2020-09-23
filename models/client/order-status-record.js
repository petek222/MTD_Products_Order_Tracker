"use strict";

const sql = require ('mssql');

const MSSQLInputParam = require('../databases/ms-sql/ms-sql-input-param');

class OrderStatus
{
    // GRAB THE JSON AS WELL
    constructor(orderId, json, offlineTokenList, epcotOrderNumber, recordCreated, writtenToEpcot, env, sourceDetails, site, orderType) 
    {
        this.orderId = orderId;
        this.json = json;
        this.offlineTokenList = offlineTokenList;
        this.epcotOrderNumber = epcotOrderNumber;
        this.recordCreated = recordCreated;
        this.writtenToEpcot = writtenToEpcot;
        this.env = env;
        this.sourceDetails = sourceDetails;
        this.site = site;
        this.orderType = orderType;
    }

    /*
     * This is a hacked up workaround to try to simulate Java reflection 
     * on variable names ... :-) ajc
     */
    getOrderIdColumnName()
    {
        return "order_id";
    }

    getOrderIdType()
    {
        return sql.VarChar;
    }

    addOrderIdParam(orderId)
    {
        return new MSSQLInputParam(this.getOrderIdColumnName(), this.getOrderIdType(), orderId);
    }

    addNewOrderIdParam(orderId)
    {
        return new MSSQLInputParam('new_order_id', sql.VarChar, orderId);
    }

    getSourceColumnName()
    {
        return "source";
    }
    
    getSourceType()
    {
        return sql.VarChar;
    }

    addSourceParam(source)
    {
        return new MSSQLInputParam(this.getSourceColumnName(), this.getSourceType(), source);
    }

    getJsonColumnName()
    {
        return "json";
    }
    
    getJsonType()
    {
        return sql.Text;
    }

    addJsonParam(json)
    {
        return new MSSQLInputParam(this.getJsonColumnName(), this.getJsonType(), json);
    }    

    getOfflineTokenListColumnName()
    {
        return "offline_token_list";
    }
    
    getOfflineTokenListType()
    {
        return sql.Text;
    }

    addOfflineTokenListParam(offlineTokenList)
    {
        return new MSSQLInputParam(this.getOfflineTokenListColumnName()
            , this.getOfflineTokenListType(), offlineTokenList);
    }

    getEpcotOrderNumberColumnName()
    {
        return "epcot_order_number";
    }
    
    getEpcotOrderNumberType()
    {
        return sql.Text;
    }

    addEpcotOrderNumberParam(epcotOrderNumber)
    {
        return new MSSQLInputParam(this.getEpcotOrderNumberColumnName()
            , this.getEpcotOrderNumberType(), epcotOrderNumber);
    }

    getEpcotSalesOrderIdColumnName()
    {
        return "epcot_sales_order_id";
    }
    
    getEpcotSalesOrderIdType()
    {
        return sql.VarChar;
    }

    addEpcotSalesOrderIdParam(epcotSalesOrderId)
    {
        return new MSSQLInputParam(this.getEpcotSalesOrderIdColumnName(),
            this.getEpcotSalesOrderIdType(), epcotSalesOrderId);
    }

    getRecordCreatedColumnName()
    {
        return "record_created";
    }
    
    getRecordCreatedType()
    {
        return sql.DateTime;
    }

    addRecordCreatedParam(recordCreated)
    {
        return new MSSQLInputParam(this.getRecordCreatedColumnName(), this.getRecordCreatedType(), recordCreated);
    }      

    getLastUpdatedColumnName()
    {
        return "last_updated";
    }
    
    getLastUpdatedType()
    {
        return sql.DateTime;
    }

    addLastUpdatedParam(updatedDate)
    {
        return new MSSQLInputParam(this.getLastUpdatedColumnName(),
            this.getLastUpdatedType(), updatedDate);
    }

    getOrderServiceSendStatusColumnName()
    {
        return "order_service_send_status";
    }
    
    getOrderServiceSendStatusType()
    {
        return sql.VarChar;
    }

    addOrderServiceSendStatusParam(orderServiceSendStatus)
    {
        return new MSSQLInputParam(this.getOrderServiceSendStatusColumnName(),
            this.getOrderServiceSendStatusType(), orderServiceSendStatus);
    }

    getOrderServiceSendErrorColumnName()
    {
        return "order_service_send_error";
    }
    
    getOrderServiceSendErrorType()
    {
        return sql.VarChar;
    }

    addOrderServiceSendErrorParam(orderServiceSendError)
    {
        return new MSSQLInputParam(this.getOrderServiceSendErrorColumnName(),
            this.getOrderServiceSendErrorType(), orderServiceSendError);
    }

    getOrderServiceSendDateColumnName()
    {
        return "order_service_send_date";
    }
    
    getOrderServiceSendDateType()
    {
        return sql.DateTime;
    }

    addOrderServiceSendDateParam(updatedDate)
    {
        return new MSSQLInputParam(this.getOrderServiceSendDateColumnName(),
            this.getOrderServiceSendDateType(), updatedDate)
    }

    getWrittenToEpcotColumnName()
    {
        return "written_to_epcot";
    }
    
    getWrittenToEpcotType()
    {
        return sql.DateTime;
    }

    addWrittenToEpcotParam(updatedDate)
    {
        return new MSSQLInputParam(this.getWrittenToEpcotColumnName(),
            this.getWrittenToEpcotType(), updatedDate);
    }

    getEnvColumnName()
    {
        return "env";
    }
    
    getEnvType()
    {
        return sql.VarChar;
    }

    addEnvParam(env)
    {
        return new MSSQLInputParam(this.getEnvColumnName(),
                this.getEnvType(), env);
    }

    getSourceDetailsColumnName()
    {
        return "source_details";
    }
    
    getSourceDetailsType()
    {
        return sql.VarChar;
    }

    addSourceDetailsParam(sourceDetails)
    {
        return new MSSQLInputParam(this.getSourceDetailsColumnName(), this.getSourceDetailsType(), sourceDetails);
    }     

    getSiteColumnName()
    {
        return "site";
    }
    
    getSiteType()
    {
        return sql.VarChar;
    }

    addSiteParam(site)
    {
        return new MSSQLInputParam(this.getSiteColumnName(), this.getSiteType(), site);
    }      

    getOrderTypeColumnName()
    {
        return "order_type";
    }
    
    getOrderTypeType()
    {
        return sql.VarChar;
    }

    addOrderTypeParam(orderType)
    {
        return new MSSQLInputParam(this.getOrderTypeColumnName(), this.getOrderTypeType(), orderType);
    }        
}

module.exports=OrderStatus;