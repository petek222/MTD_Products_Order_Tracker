"use strict";

class MsSqlInputParam
{
    constructor(columnName, columnType, columnValue)
    {
        this.columnName = columnName;
        this.columnType = columnType;      
        this.columnValue = columnValue;                   
    }
}

module.exports = MsSqlInputParam;
      