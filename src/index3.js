import express from "express";
import { adminAuthFunction, userAuthFunction } from "./middlewares/auth.js";

const app = express();

app.use("/admin", adminAuthFunction);

app.get("/admin/getUserList", (req, res) => {
    res.send("User List");
});

app.post("/admin/deleteUser", (req, res) => {
    res.send("Deleted User");
});

// For the below request handler middleware will not be called as middleware supports only /admin routes
app.get("/user/userDetails", userAuthFunction, (req, res) => {
    throw new Error(
        "Thrown new error to check Error handler middelware's functionality",
    );
    res.send("User details");
});

// No need to check user validation while user logging in so no need to pass middleware here for this route.
app.post("/user/login", (req, res) => {
    res.send("User logged in successfully");
});

// To handler the errors in any of the route we should add a Error handler to handle errors coming from any route gracefully
// This function should be writeen at the last (Routes Order matters).
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong returned error " + err);
    }
});

app.listen(3002, () => {
    console.log("App listening on port 3002");
});
