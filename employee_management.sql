CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- Spring Boot/JPA creates the employees table automatically.
-- Optional sample records:
INSERT INTO employees (name, email, department, salary, phone) VALUES
('Rahul Kumar', 'rahul@example.com', 'IT', 55000, '9876543210'),
('Priya Sharma', 'priya@example.com', 'HR', 48000, '9876543211'),
('Arun Reddy', 'arun@example.com', 'Finance', 52000, '9876543212');
