var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Gwen!1987",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    runSearch();
});
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    products();
                    break;

                case "View Low Inventory":
                    findProducts();
                    break;

                case "Add to Inventory":
                    rangeSearch();
                    break;

                case "Add New Product":
                    songSearch();
                    break;
            }
        });
}

function products() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("---------------------------------------------------------------------------------" + "\n");
        connection.end();
    });
}


function findProducts() {
    var query = "SELECT * FROM products";
    let itemToOrder = [];
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                itemToOrder.push(res[i].product_name)
            } 
        }
        console.log("Because ther is 5 items or less. You need to order: " + itemToOrder)
        console.log("---------------------------------------------------------------------" + "\n");
        connection.end();
    });
}