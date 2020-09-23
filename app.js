var express = require('express');
var router1 = require('./routes/orderLookup');
const app = express();
const contextRoot = '/mtd-order-lookup-service';
var cors = require('cors');

app.use(cors());
app.use(contextRoot,router1);
const serverLevel = process.env.SERVER_LEVEL;
const versionNumber = process.env.MTD_DOCKER_VER;



app.get(contextRoot+ '/check', (req, res) => {
    console.log(contextRoot + ' Health Check Request - Server level : "'+ serverLevel + '", Version : "'+ versionNumber+'"' );
    res.send("Server level : "+ serverLevel + "<br/>Version : " + versionNumber);

});

var port = 8080;
app.listen(port);
console.log('Application started on port ' + port);