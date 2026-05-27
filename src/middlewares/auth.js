import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const adminAuthFunction = (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log(authToken);
    const token = "Bearer xyzw";
    const isAdmin = authToken === token;
    if (!isAdmin) {
        res.status(401).send("Unauthorized role only admins have access");
    } else {
        next();
    }
};

export const userAuthFunction = (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log(authToken);
    const token = "Bearer abcd";
    const isValidUser = authToken === token;
    if (!isValidUser) {
        res.status(401).send("Invalid user");
    } else {
        next();
    }
};

// Create a middleware to validate the JWT token and authenticate the user for protected routes
export const authValidation = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        // Verify JWT token and extract user information
        const decodedMessage = jwt.verify(token, "DEVTinderSecretKey$790");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).send("Error validating token " + error.message);
    }
};
