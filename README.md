# NodeJS Task Manager Backend

This project implements a task manager backend using Node.js, Express.js, and SQLite3. It provides RESTful API endpoints for managing tasks, users, and authentication.

## Table of Contents
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)

## Project Structure

The project structure is organized as follows:
 - app.js # Main application file
 - task_manager.db # SQLite database file
 - package.json # Node.js package configuration
 - README.md # Project documentation

## Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/vundelavamsitask-manager-backend-epimax
    cd nodejs-task-manager-backend
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Configure environment variables:**
    
    Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3001
    ```
4. **Start the server:**
    ```bash
    npm start
    ```

## API Endpoints

The API endpoints are as follows:

- `POST /register`: Register a new user.
- `GET /users`: Get all users.
- `POST /login`: Log in a user and obtain a JWT token.
- `POST /tasks`: Create a new task.
- `GET /tasks`: Get all tasks.
- `GET /tasks/:id`: Get a specific task by ID.
- `PUT /tasks/:id`: Update a specific task by ID.
- `DELETE /tasks/:id`: Delete a specific task by ID.

## Authentication

User authentication is implemented using JWT (JSON Web Tokens). When a user logs in, a JWT token is generated and sent back as a response. This token must be included in the `Authorization` header of subsequent requests to access protected endpoints.
