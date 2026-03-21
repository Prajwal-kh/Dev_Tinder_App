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
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send("User added successfully to db");
    } catch (error) {
        res.status(400).send("Error saving the user into db " + error);
    }
});

app.get("/user/:email", async (req, res) => {
    try {
        const userEmailId = req.params.email;
        const requestedUser = await User.findOne({ email: userEmailId });
        if (!requestedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(requestedUser);
    } catch (error) {
        res.status(400).send("Unable to get the list of all users " + error);
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).send(users);
    } catch (error) {
        res.status(400).send("Unable to get the list of all users " + error);
    }
});

app.delete("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        // If we want to delete a user by passing user id we can use findByIdAndDelete method
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res
                .status(400)
                .send("Unable to delete user due to invalid user id");
        }

        res.send("User " + userId + " deleted Successfully");
    } catch (error) {
        res.status(400).send("Unable to delete user " + error);
    }
});

app.patch("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const data = req.body;
        // findByIdAndUpdate method works similar to findOneAndUpdate() if we are updating user by id
        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
        });
        console.log("user new details: ", updatedUser);
        if (!updatedUser) {
            return res
                .status(400)
                .send("Unable to update user due to invalid user id");
        }

        res.send("User " + userId + " updated Successfully");
    } catch (error) {
        res.status(400).send("Unable to update user " + error);
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
