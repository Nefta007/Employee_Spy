//const cTable = require('console.table');
const inquirer = require('inquirer');
const connect = require('./config/connection');
const { deprecate } = require('util');



function init() {
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
        const { user_choice } = answers;
        switch (user_choice) {
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
    // console.log("hello");
    connect.promise().query(
        `SELECT * FROM department`
    ).then(([data]) => console.table(data));
}

function ViewAllRoles() {
    //console.log("hello");
    connect.promise().query(`
    SELECT 
    roles.title,
    roles.id,
    roles.salary,
    department.dep_name AS department 
    FROM roles 
    INNER JOIN department ON roles.department_id = department.id`)
        .then(([data]) => console.table(data));

}

function ViewAllEmployees() {
    // console.log("hello");
    connect.promise().query(`
    SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    roles.title,
    roles.salary,
    department.dep_name, 
    CONCAT(manEmployee.first_name, " ", manEmployee.last_name) AS manager
    FROM employee
    JOIN roles ON employee.role_id = roles.id
    JOIN department ON roles.department_id = department.id
    LEFT JOIN employee as manEmployee ON employee.manager_id = manEmployee.id`)
        .then(([data]) => console.table(data));
}

function AddADepartment() {
    // console.log("hello");
    inquirer.prompt([{
        type: "input",
        name: "newDepartment",
        message: "What is the name of the Department you wish to add?"
    }]).then((answer) => {
        connect.promise().query(`INSERT INTO department (dep_name) VALUE (?)`, answer.newDepartment);
        viewAllDepartments();
    })
}

function AddARole() {
    //console.log("hello");
    const userDepo = `SELECT * FROM department`;
    connect.query(userDepo, (err, ress) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'role_name',
                message: 'What is the name of the role you wish to enter?'
            },
            {
                type: 'number',
                name: 'role_salary',
                message: 'What is the salary for the new role?'
            },
            {
                type: 'list',
                name: 'roles_department',
                message: 'What department does the role belong to?',
                choices: ress.map((roles_department)=>roles_department.dep_name),
            }
        ]).then((data) => {
            const new_role = data.role_name;
            const new_salary = data.role_salary;
            const new_department = data.roles_department;
            connect.promise().query(`
            INSERT INTO roles (title, salary, department_id) VALUE(?)
            FROM roles
            JOIN department ON roles.department_id = department.id
            `, new_role, new_salary, new_department);
            ViewAllRoles();
        })
    });
}

function AddAnEmployee() {
    console.log("hello");
}

function UpdateAnEmployeeRole() {
    console.log("hello");
}

init();