//const cTable = require('console.table');
const inquirer = require('inquirer');
const connect = require('./config/connection');

// WHEN I start the application
// THEN I am presented with the following 
// options: view all departments, view all roles, 
// view all employees, add a department, add a role, 
// add an employee, and update an employee role


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
            case "Quit":
                // quitfunction();
                console.log("Thank you for your use");
                break;
            default:
                console.log("Have a nice day!");
        }
    })
};

//changed code to call init()
// WHEN I choose to view all departments
// THEN I am presented with a formatted 
// table showing department names and department ids

function viewAllDepartments() {
    // console.log("hello");
    const sql = `SELECT * FROM department`;
    connect.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
        init();
    }
    );//.then(([data]) => console.table(data));
    //init() does not display properly
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, 
// role id, the department that role belongs 
// to, and the salary for that role
function ViewAllRoles() {
    //console.log("hello");
    const sql = `
    SELECT 
    roles.title,
    roles.id,
    roles.salary,
    department.dep_name AS department 
    FROM roles 
    INNER JOIN department ON roles.department_id = department.id`;
    connect.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
        init();
    }
    );
    //.then(([data]) => console.table(data));
}

// WHEN I choose to view all employees
// THEN I am presented with a formatted 
// table showing employee data, including 
// employee ids, first names, last names, job 
// titles, departments, salaries, and managers 
// that the employees report to
function ViewAllEmployees() {
    // console.log("hello");
    const sql = `
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
    LEFT JOIN employee as manEmployee ON employee.manager_id = manEmployee.id`
    connect.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        };
        console.table(res);
        init();
    }
    );
    //.then(([data]) => console.table(data));
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name 
// of the department and that department 
// is added to the database
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

// WHEN I choose to add a role
// THEN I am prompted to enter the
//  name, salary, and department for 
//  the role and that role is added 
//  to the database
function AddARole() {
    //console.log("hello");
    const userDepo = `SELECT * FROM department`;
    connect.query(userDepo, (err, res) => {
        if (err) throw err;
        currDepartments = res.map((departments) => ({
            name: departments.dep_name,
            value: departments.id
        }));
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
                name: 'role_department',
                message: 'What department does the role belong to?',
                choices: currDepartments,
            },
        ]).then((data) => {
            connect.promise().query(`
            INSERT INTO roles SET ?
            `, { title: data.role_name, salary: data.role_salary, department_id: data.role_department });
            ViewAllRoles();
        })
    });
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the 
// employee’s first name, last name, 
// role, and manager, and that employee 
// is added to the database
function AddAnEmployee() {
    //console.log("hello");
    const userEmployee = `SELECT * FROM employee`;
    connect.query(userEmployee, (err, res) => {
        if (err) throw err;
        currEmployee = res.map((Employees) => ({
            name: Employees.first_name.concat(" ", Employees.last_name),
            value: Employees.id
        }));
        const userDepo = `SELECT * FROM roles`;
        connect.query(userDepo, (err, res) => {
            if (err) throw err;
            currRoles = res.map((roles) => ({
                name: roles.title,
                value: roles.id
            }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employess last name?'
                },
                {
                    type: 'list',
                    name: 'role_list',
                    message: 'What role is the employee in charge of?',
                    choices: currRoles,
                },
                {
                    type: 'list',
                    name: 'employee_manager',
                    message: "Who is the employees manager?",
                    choices: currEmployee
                }
            ]).then((data) => {
                connect.promise().query(`
                INSERT INTO employee SET ?
                `, { first_name: data.firstName, last_name: data.lastName, role_id: data.role_list, manager_id: data.employee_manager });
                ViewAllEmployees();
            })
        });
    });
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee 
// to update and their new role and this 
// information is updated in the database 

function UpdateAnEmployeeRole() {
    // console.log("hello");
    const userEmployee = `SELECT * FROM employee`;
    connect.query(userEmployee, (err, res) => {
        if (err) throw err;
        currEmployee = res.map((Employees) => ({
            name: Employees.first_name.concat(" ", Employees.last_name),
            value: Employees.id
        }));
        const userDepo = `SELECT * FROM roles`;
        connect.query(userDepo, (err, res) => {
            if (err) throw err;
            currRoles = res.map((roles) => ({
                name: roles.title,
                value: roles.id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'chosen_employee',
                    message: 'Which employee do you wish to update?',
                    choices: currEmployee
                },
                {
                    type: 'list',
                    name: 'newRoles',
                    message: 'What will be the employees new role?',
                    choices: currRoles
                },
                {
                    type: 'list',
                    name: 'employee_manager',
                    message: "Who is the employees manager?",
                    choices: currEmployee
                }
            ]).then((data) => {
                connect.promise().query(`
                UPDATE employee SET role_id = ${data.newRoles}, manager_id= ${data.employee_manager} WHERE id= ${data.chosen_employee};`);
                ViewAllEmployees();
            })
        });
    });
}

// function quitfunction(){
//     console.log('Have a nice day');
//     break
// }

init();