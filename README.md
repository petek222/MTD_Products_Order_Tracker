[![Build Status](https://travis-ci.com/petek222/MTD_Products_Order_Tracker.svg?branch=master)](https://travis-ci.com/petek222/MTD_Products_Order_Tracker)

# Introduction
mtd-order-lookup-service is a Node.js application frontended with a React framework UI to streamline the process of obtaining information for orders throughout the online order process. For frontend React.js framework UI build, see order-status-hub-ui git repo.

Currently used in production at MTD Products: primary project for internship of Summer 2019. Used across IT to test and maintain MTD's online shopping application. Repo contains base code; config and authentication information is housed in private servers.

# Dependencies
Please note that the CI build is currently an error due to dependency issues with the node-oracledb package and the tested linux kernel of the CI. All other tests are passing. Deployed via AWS; testable as localhost application.

# Special setup notes
RAM Allocation may need to be larger than typical 512 mb, alter as needed.

Set environment vars in the task-definition:

```"name": "NODE_OPTIONS","value": "--max_old_space_size=MEMORY_VAL"```

```"name": "SERVER_LEVEL", "value": "[dev|test|prod|local]"```

```"name": "LOGGER_LEVEL", "value": "[debug|info|error]"```

FTP server route has to be specified manually for builds and test deploys. Currently operates on temp/orders/dirname.

# Getting Started
FOR TEST:
1. Application has its disparate components, but currently runs through a large route '/getOrderInfo' for a specified order_number param.
2. Start nodemon server, run localhost below with specified order_number and /getOrderInfo route.
3. Mass amounts of unfiltered data is returned currently, to be filtered and made readable.
4. Passed off to helper function, condenses down data returns into a formalized JSON file structure.
5. JSON is handed off to React.js order-status-hub-ui, that will display information and progress as anticipated to user.

# Build and Test

Current tests are specified for each service's respective getter. Foundational tests exist for each preexisting controller, with the 
route tested manually via browser run against nodemon server. All tests use mocha / chai frameworks.
1. To run all tests: npm test
2. To run specific test: npm test test/'testfilename'
3. To run outer route: nodemon, browser with the following route:
--
http://localhost:8080/mtd-order-lookup-service/getOrderInfo?orderNumber=ORDER_TEST_PARAM
--

# Contribute

Author: Peter Koncelik
Last Commit: September 2020
