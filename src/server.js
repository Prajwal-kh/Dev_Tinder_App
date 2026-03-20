import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app = express();
const port = "7000";

// Connect to the database before starting the server
await connectDB();

app.post("/signup", async (req, res) => {
    // Creating new instance of User model
    const user = new User({
        firstName: "Pratik",
        lastName: "Kharode",
        email: "pratikk@gmail.com",
        password: "pratikk4123",
    });
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
