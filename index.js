import express from "express";

// creating a new expres js application using express in other words new web server
const app = express();

// Request handlers:
app.get("/users", (req, res) => {
    res.send([
        {
            name: "User1",
            gmail: "user1@gmail.com",
        },
    ]);
});

app.post("/user", (req, res) => {
    console.log(req);
    res.send(req.body?.name);
});

app.put("/user", (req, res) => {
    res.send("Updated user details");
});

app.patch("/user", (req, res) => {
    res.send("Updated specific detail");
});

app.delete("/user", (req, res) => {
    res.send("Deleted Successfully");
});

// This will match all HTTP method API calls to / route for the routes comes after this
app.use("/", (req, res) => {
    res.send("Default Response if no routes matched");
});

// app/ server is listening  on port 3000 to handle incoming requests.
app.listen(3000, () => {
    console.log("Application is running on port 3000");
});
