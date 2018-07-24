var mysql = require("mysql");
var inquirer = require("inquirer");

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
    products();
});

function products() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_ID + " || Product Name: " + res[i].product_name 
                + " || Department Name: " + res[i].department_name + " || Price: " + res[i].price 
                + " || Stock Quantity: " + res[i].stock_quantity + "\n");
        }
        console.log("---------------------------------------------------------------------------------" + "\n");
        runSearch()
    });
}

function runSearch() {
    inquirer
        .prompt({
            name: "product",
            message: "What prodcut would you like buy?"
        },
        {
            name: "quantity",
            message: "How much would you like buy?"
        })
        .then(function (answer) {
            
        });
}

