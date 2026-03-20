import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app = express();
const port = "7000";

// Connect to the database before starting the server
await connectDB();

// To read the incoming JSON data and convert it into a JS object we need to pass a middleware to all routes
// This will put it into the the req.body and give us access to read the data in JS object
app.use(express.json());

app.post("/signup", async (req, res) => {
    const data = req.body;
    console.log(data);
    // Creating new instance of User model
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send("User added successfully to db");
    } catch (error) {
        res.status(400).send("Error saving the user into db " + error);
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
