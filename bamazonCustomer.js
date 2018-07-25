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
    products();
});

function products() {
    var query = "SELECT * FROM products";
    let items = [];
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product_name);
        }
        console.log("---------------------------------------------------------------------------------" + "\n");
        runSearch(items)
    });
}

function runSearch(items) {
    inquirer
        .prompt([{
            name: "product",
            type: "list",
            message: "What prodcut would you like buy?",
            choices: items
        },
        {
            name: "quantity",
            type: "input",
            message: "How much would you like buy?"
        }])
        .then(function (answer) {
            let product = answer.product;
            let quantity = answer.quantity;
            if (Number.isInteger(parseInt(quantity))) {
                checkAvailibilty(product, quantity)
            } else {
                console.log("!!!!!Sell was unalbe to be complted!!!!! \nPlease enter a valid number")
            }
            
        });
}


function checkAvailibilty(product, quantity){
    
    connection.query("SELECT stock_quantity, price FROM products WHERE product_name=?", [product], function (err, res) {
        if (err) throw err;
        let itemsLeft = res[0].stock_quantity;
        let itemPrice = res[0].price;
        let totaleSale = itemPrice * quantity
        if (itemsLeft - quantity > 0) {
            console.log("You just bought " + quantity + " " + product + "s for $" + totaleSale);
            updateDB(itemsLeft - quantity, product);
        } else {
            console.log("!!!!Insufficient quantity!!!!");
        }
    });
}


function updateDB(updateInventory, product){
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: updateInventory
        },
        {
            product_name: product
        }
    ], function(err, res) {
        if (err) throw err;
    })
}