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
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    totalProfit();
                    break;

                case "Create New Department":
                    addNewProduct();
                    break;
            }
        });
}

function addNewProduct() {
    inquirer
        .prompt([{
            name: "addDepartment",
            type: "input",
            message: "what is the new department do you want to add?"
        },
        {
            name: "overHeadCosts",
            type: "input",
            message: "What is the over head cost for this department?"
        }])
        .then(function (answer) {
            let addDepartment = answer.addDepartment;
            let overHeadCosts = answer.overHeadCosts;
            var query = 'INSERT INTO departments (department_name, over_head_costs) VALUES(' + '"' + addDepartment + '"' + ', ' + overHeadCosts + ')';
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(addDepartment, overHeadCosts);
                console.log("---------------------------------------------------------------------------------" + "\n");
                departments();
            });
        });
}

function departments() {
    var query = "SELECT * FROM departments";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("---------------------------------------------------------------------------------" + "\n");
        connection.end();
    });
}

function totalProfit() {
    
    connection.query("SELECT d.department_id, d.department_name, SUM(d.over_head_costs) AS total_over_head, " +
        " SUM(p.product_sales) AS total_product_sales, " +
        " SUM(p.product_sales) - SUM(d.over_head_costs) AS total_profit " +
        " FROM departments d " +
        " INNER JOIN products p ON " +
        " d.department_name = p.department_name " +
        " GROUP BY d.department_id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("---------------------------------------------------------------------------------" + "\n");
        connection.end();
    });
}