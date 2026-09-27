# Employee Management System

A modern web-based Employee Management System built with **Java, Spring Boot, MySQL, HTML, CSS and JavaScript**.

## Features

- Dashboard with employee statistics
- Add employee
- View employees
- Search by name or department
- Edit employee
- Delete employee
- Department filtering through search
- Form validation
- REST API
- MySQL persistence
- Responsive web interface
- Layered architecture: Controller → Service → Repository

## Tech Stack

**Frontend:** HTML, CSS, JavaScript  
**Backend:** Java, Spring Boot, REST API  
**Database:** MySQL  
**ORM:** Spring Data JPA / Hibernate  
**Build Tool:** Maven

## Project Structure

```text
Employee-Management-System/
├── database/
│   └── employee_management.sql
├── src/
│   ├── EmployeeManagementApplication.java
│   ├── Employee.java
│   ├── EmployeeController.java
│   ├── EmployeeService.java
│   └── EmployeeRepository.java
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── employee_management.sql
├── application.properties
├── pom.xml
├── .gitignore
└── README.md
```

## How to Run

### 1. Requirements

Install:
- Java 17+
- MySQL 8+
- IntelliJ IDEA or VS Code
- Maven (or use the Maven wrapper if added)

### 2. Create the database

Open MySQL and run:

```sql
CREATE DATABASE employee_management;
```

You can also run the SQL file in `database/employee_management.sql`.

### 3. Configure MySQL

Open:

`src/main/resources/application.properties`

Change:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

to your MySQL username/password.

### 4. Run the application

From the project root:

```bash
mvn spring-boot:run
```

Then open:

`http://localhost:8080`

The EmployeeHub dashboard will open in your browser.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get one employee |
| GET | `/api/employees/search?keyword=IT` | Search employees |
| POST | `/api/employees` | Add employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

## Resume Project Description

**Employee Management System | Java, Spring Boot, MySQL, JavaScript**

Developed a responsive employee management web application with CRUD operations using Spring Boot REST APIs and MySQL. Implemented layered architecture with Controller, Service and Repository components, along with form validation, employee search and dashboard statistics.

## Author

**Uppara Baby**


## Simple Project Layout

This project intentionally uses a simple folder structure so it is easy to upload and manage on GitHub.

> Note: The Java source files are kept in one folder for portfolio simplicity. For a larger production application, package-based folders are recommended.

### Running the simple layout

1. Create the `employee_management` MySQL database.
2. Set your MySQL password in `application.properties`.
3. Run `EmployeeManagementApplication.java`.
4. Open `frontend/index.html` in your browser.
5. The frontend calls the Spring Boot API at `http://localhost:8080`.
