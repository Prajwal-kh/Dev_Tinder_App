import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import validateSignupData from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { authValidation } from "./middlewares/auth.js";

const app = express();
const port = "7000";

// Connect to the database before starting the server
await connectDB();

// To read the incoming JSON data and convert it into a JS object we need to pass a middleware to all routes
// This will put it into the the req.body and give us access to read the data in JS object
app.use(express.json());
app.use(cookieParser());

// Data sanitization and validation should be done in the schema level as much as possible to maintain the data integrity and to
// avoid writing the same code again and again in each route handler.
// We can also write custom validation functions in the schema to validate the data according to our requirements.
app.post("/signup", async (req, res) => {
    try {
        // Validation of incoming data
        validateSignupData(req.body);

        const { firstName, lastName, email, password } = req.body;
        // Encrypting the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // Creating a new instance of user object and saving it into the database
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).send("User added successfully to db");
    } catch (error) {
        res.status(400).send("Error saving the user into db " + error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // We can write the password validation logic in the mongoose schema method to maintain the separation of concerns.
        const isPasswordMatch = await user.validatePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).send("Invalid credentials");
        }
        // Its better to offload the jwt token generation logic to mongoose schema
        const token = await user.getJWT();
        // Add the token in the cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000), // 1 day
            httpOnly: true,
            secure: true,
        });
        res.status(200).send("Login successful");
    } catch (error) {
        res.status(400).send("Error logging in " + error);
    }
});

app.get("/profile", authValidation, async (req, res) => {
    try {
        const user = req.user; // The user object is attached to the request by the authValidation middleware
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send("Error fetching user profile data " + error);
    }
});

app.post("/sendConnectionRequest", authValidation, async (req, res) => {
    try {
        const user = req.user; // The user object is attached to the request by the authValidation middleware
        const { recipientEmail } = req.body;
        const recipientUser = await User.findOne({ email: recipientEmail });
        if (!recipientUser) {
            return res.status(404).send("Recipient user not found");
        }
        // Here we can add the logic to send connection request to the recipient user
        res.status(200).send(
            user.firstName +
                " successfully sent connection request to " +
                recipientUser.firstName,
        );
    } catch (error) {
        res.status(400).send("Error sending connection request " + error);
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

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId;
        const data = req.body;

        const AllOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
            "firstName",
            "lastName",
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            AllOWED_UPDATES.includes(k),
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        // findByIdAndUpdate method works similar to findOneAndUpdate() if we are updating user by id
        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true, // validate schema data while updating the doc
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
