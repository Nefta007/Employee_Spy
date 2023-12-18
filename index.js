const inquirer = require('inquirer');
const management = require('./lib/employerAction')
require('dotenv').config();
const mysql = require('mysql2');

const userConnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'process.env.DB_PASSWORD',
    database: 'employee_db'
});
module.exports = userConnect;

const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'user_choice',
            message: 'What would you like to do?',
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit"
            ]
        }
    ]).then((answers) => {
        const { employer_choice } = answers;
        switch (employer_choice) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                ViewAllRoles();
                break;
            case "View all employees":
                ViewAllEmployees();
                break;
            case "Add a department":
                AddADepartment();
                break;
            case "Add a role":
                AddARole();
                break;
            case "Add an employee":
                AddAnEmployee();
                break;
            case "Update an employee role":
                UpdateAnEmployeeRole();
                break;
        }
    })
};

function viewAllDepartments() {
    console.log("hello");
}

function ViewAllRoles() {
    console.log("hello");
}

function ViewAllEmployees() {
    console.log("hello");
}

function AddADepartment() {
    console.log("hello");
}

function AddARole() {
    console.log("hello");
}

function AddAnEmployee() {
    console.log("hello");
}

function UpdateAnEmployeeRole() {
    console.log("hello");
}