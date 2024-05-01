require("dotenv").config();

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const dbPath = path.join(__dirname, "task_manager.db");

const initializeDbServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen((process.env.PORT || 3001), () => {
            console.log("DataBase Connected");
        });
    } catch(e) {
        console.log(`DB Error ${e.message}`);
        process.exit(1);
    }
}

initializeDbServer();

app.use(bodyParser.json());
app.use(cors());

// Middleware to check for Authentication
const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    // console.log(authHeader);
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    // console.log(jwtToken);
    if (jwtToken === undefined) {
      response.status(401);
      response.send("Invalid JWT Token");
    } else {
      jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
        if (error) {
          response.status(401);
          response.send("Invalid JWT Tokenn");
        } else {
          next();
        }
      });
    }
  };

//API to create a new user
app.post("/register", async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(`INSERT INTO Users (username, password) VALUES ('${username}', '${hashedPassword}')`);
        res.send("User Created");
    } catch(e) {
        console.log(`DB Error ${e.message}`);
    }
})

//API to get all the Users
app.get("/users", async (req, res) => {
    try {
        const users = await db.all(`SELECT * FROM Users`);
        res.send(users);
    } catch(e) {
        console.log(`DB Error ${e.message}`);
    }
})

//API to login the User
app.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await db.get(`SELECT * FROM Users WHERE username = '${username}'`);
        if(!user) {
            throw new Error("Invalid username or password");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            throw new Error("Invalid username or password");
        }
        const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY");
        console.log("Loged In")
        res.status(200).json(token);
    } catch(e) {
        console.log(`${e.message}`);
    }
})

//API to create a task
app.post("/tasks", authenticateToken, async (req, res) => {
    try {
        const {title, description, status, assignee_id, created_at, updated_at} = req.body;
        // console.log(title, description, status, assignee_id, created_at, updated_at);
        const result = await db.run(`INSERT INTO Tasks (title, description, status, assignee_id, created_at, updated_at) VALUES ('${title}', '${description}', '${status}', '${assignee_id}', '${created_at}', '${updated_at}')`);
        res.send("Task Created");
    }
    catch(e) {
        console.log(`${e.message}`);
    }
})

//API to get all the tasks
app.get("/tasks", authenticateToken, async (req,res) => {
    try {
        const tasks = await db.all(`SELECT * FROM Tasks`);
        res.send(tasks);
    }
    catch(e) {
        console.log(`DB Error ${e.message}`)
    }
})

//API to get a task by id
app.get("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params
        const task = await db.get(`SELECT * FROM Tasks WHERE id = ${id}`);
        res.send(task);
    }
    catch(e) {
        console.log(`DB Error ${e.message}`)
    }
})

// API to delete a task
app.put("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, status, updated_at} = req.body;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        const presentDateTime  = `${year}-${month}-${day} ${hour}:${minute}:${second}`
        const result = await db.run(`UPDATE Tasks SET title = '${title}', description = '${description}', status = '${status}', updated_at = '${presentDateTime}'  WHERE id = ${id}`);
        res.status(200).json(result);
    }
    catch(e) {
        console.log(`DB Error ${e.message}`);
    }
})

// API to delete specific task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const result = await db.run(`DELETE FROM Tasks WHERE id = ${id}`);
        res.status(200).json(result);
    }
    catch(e) {
        console.log(`DB Error ${e.message}`);
    }
})