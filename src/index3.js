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
    res.send("User details");
});

// No need to check user validation while user logging in so no need to pass middleware here for this route.
app.post("/user/login", (req, res) => {
    res.send("User logged in successfully");
});

app.listen(3002, () => {
    console.log("App listening on port 3002");
});
