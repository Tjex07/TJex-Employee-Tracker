
//declare dependancies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

//creates the database connection
let dbz_db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234qwer',
    database: 'dbz_db'
});

//surmizes the list of prompt messages
const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    viewAllRoles: "View All Roles",
    viewAllDepartments: "View all Departments",
    addEmployee: "Add Employee",
    addDepartment: "Add Department",
    addRole: "Add Role",
    exit: "Exit",

};


//if the DB doesnt connect an throw error will be logged
dbz_db.connect(err => {
    if (err) throw err;
    prompt();
});

// creates the prompt function to prompt menu options
function prompt() {
    inquirer
        .prompt({
            name: 'select',
            type: 'list',
            message: 'How might i assist you today?',
            choices: [
                promptMessages.viewAllEmployees,
                promptMessages.viewByDepartment,
                promptMessages.viewByManager,
                promptMessages.viewAllRoles,
                promptMessages.viewAllDepartments,
                promptMessages.addEmployee,
                promptMessages.addDepartment,
                promptMessages.addRole,
                promptMessages.exit,

            ]
        })

        //Lists all the switch cases for promptMessages
        .then(answer => {
            console.log('answer', answer);
            switch (answer.select) {
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case promptMessages.viewByDepartment:
                    viewByDepartment();
                    break;

                case promptMessages.viewByManager:
                    viewByManager();
                    break;

                case promptMessages.viewAllDepartments:
                    viewAllDepartments();
                    break;


                case promptMessages.viewAllRoles:
                    viewAllRoles();
                    break;

                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                case promptMessages.addDepartment:
                    addDepartment();
                    break;

                case promptMessages.addRole:
                    addRole();
                    break;

                case promptMessages.exit:
                    dbz_db.end();
                    break;
            }
        });
}
//Displays the data when the viewAllEmployees option is selected.

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    dbz_db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

//Displays the data when the viewByDepartment option is selected.

function viewByDepartment() {
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    dbz_db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });
}


//Displays the data when the viewByManager option is selected.

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    dbz_db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

//Displays the data when the viewAllRoles option is selected.

function viewAllRoles() {
    const query = `SELECT role.title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    dbz_db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW Roles');
        console.log('\n');
        console.table(res);
        prompt();
    });

}


//Displays the data when the viewAllDepartments option is selected.
function viewAllDepartments() {
    const query = `SELECT department.name AS department
    FROM department`;
    dbz_db.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });

}


//Displays the data when the addEmployee option is selected.
async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    dbz_db.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        dbz_db.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            dbz_db.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}

//Displays the data when the addRole option is selected.
async function addRole() {
    const addname = await inquirer.prompt(askRole());
    dbz_db.query('SELECT department.id, department.name FROM department', async (err, res) => {
        if (err) throw err;
        const { department } = await inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                choices: () => res.map(res => res.name),
                message: 'What department will this role belong to?: '
            }
        ]);
        let departmentId;
        for (const row of res) {
            if (row.name === department) {
                departmentId = row.id;
                continue;
            }
        }

        console.log('Role has been added. Please view all roles to verify...');
        dbz_db.query(
            'INSERT INTO role SET ?',
            {
                title: addname.title,
                salary: addname.salary,
                department_id: departmentId,
            },
            (err, res) => {
                if (err) throw err;
                prompt();

            }
        );
    });
};

//Displays the data when the addDepartment option is selected.
async function addDepartment() {
    const addname = await inquirer.prompt(askDepartment());


    console.log('Department has been added. Please view all Departments to verify...');
    dbz_db.query(
        'INSERT INTO department SET ?',
        {
            name: addname.name,
        },
        (err, res) => {
            if (err) throw err;
            prompt();

        }
    );
}

//Displays the data when the askName option is selected.

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "What is the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "What is the last name: "
        }
    ]);
}

//Displays the data when the askDepartment option is selected.

function askDepartment() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department."
        },

    ]);
}

//Displays the data when the askRole option is selected.
function askRole() {
    return ([
        {
            name: "title",
            type: "input",
            message: "What is the name of the new role."
        },
        {
            name: "salary",
            type: "input",
            message: "What salary does this role make?"
        },

    ]);
}
