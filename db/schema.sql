DROP DATABASE IF EXISTS dbz_db;
CREATE DATABASE dbz_db;
USE dbz_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
     id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INT NOT NUll,
    manager_id INT,
    PRIMARY KEY(id)
);



use dbz_db;

INSERT INTO department
    (name)
VALUES
    ('Saiyans'),
    ('Namekians'),
    ('Support'),
    ('Capsule Corp');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Saiyan Warrior', 9001, 1),
    ('Saiyan Prince', 8999, 1),
    ('Half Saiyan', 9000, 1),
    ('Saiyan Babysitter', 4500, 2),
    ('Scientist', 7000000, 4),
    ('Meat Shield', 100, 3),
    ('Super Saiyan Enabler', 45000000, 2),
    ('Gaurdian of Earth', 25000000, 2);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Goku', 'Kakarot', 1, 1),
    ('Vegeta', 'Vegetable', 2, 2),
    ('Gohan', 'Rice', 3, 3),
    ('Piccolo', 'Slug', 4, 4),
    ('Bulma', '"Encanto"', 5, 5),
    ('Yamcha', 'Yum Cha', 6, 6),
    ('Krillin', NULL, 7, 7),
    ('Dende', Null, 8, 8);
    