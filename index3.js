import express from "express";

const app = express();

// Middewares actual use case
// Creating a middleware to check if its an admin for all /admin routes
app.use("/admin", (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log(authToken);
    const token = "Bearer xyzw";
    const isAdmin = authToken === token;
    if (!isAdmin) {
        res.status(401).send("Unauthorized role only admins have access");
    } else {
        next();
    }
});

app.get("/admin/getUserList", (req, res) => {
    res.send("User List");
});

app.post("/admin/deleteUser", (req, res) => {
    res.send("deleted User");
});

// For the below request handler middleware will not be called as middleware supports only /admin routes
app.get("/user", (req, res) => {
    res.send("User details");
});

app.listen(3002, () => {
    console.log("App listening on port 3002");
});
