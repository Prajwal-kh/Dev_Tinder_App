import express from "express";

// creating a new expres js application using express in other words new web server
const app = express();

// Request handlers:
app.use("/", (req, res) => {
    res.send("Response from dashboard");
});

// app/ server is listening on port 3000 to handle incoming requests.
app.listen(3000, () => {
    console.log("Application is running on port 3000");
});
