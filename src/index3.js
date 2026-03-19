import express from "express";
import { adminAuthFunction } from "./middlewares/auth.js";

const app = express();

app.use("/admin", adminAuthFunction);

app.get("/admin/getUserList", (req, res) => {
    res.send("User List");
});

app.post("/admin/deleteUser", (req, res) => {
    res.send("Deleted User");
});

// For the below request handler middleware will not be called as middleware supports only /admin routes
app.get("/user", (req, res) => {
    res.send("User details");
});

app.listen(3002, () => {
    console.log("App listening on port 3002");
});
