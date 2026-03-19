import express from "express";

const app = express();

// Multiple Route handlers or Middewares
app.get(
    "/",
    (req, res, next) => {
        console.log("Handeling route handler 1");
        // res.send("1st Response");
        next();
    },
    (req, res, next) => {
        console.log("Handeling route handler 2");
        // next(); // uncomment & try to call next before res.send to check the 3rd Response with error: Cannot set headers after they are sent to the client
        res.send("2nd Response");
        next();
    },
    (req, res) => {
        console.log("Handeling route handler 3");
        res.send("3rd Response"); // Request Handler
    },
);

// We can even handle route handlers it in two seperate routes
/*
app.get("/", (req, res, next) => {
    console.log("Handeling route handler 1");
    // res.send("1st Response");
    next();
});
// Above route handler will become a middleware in this case as its calling next() without sending a response from its route handler.

app.get("/", (req, res) => {
    console.log("Handeling route handler 2");
    res.send("2nd Response");
});
// This above function will be called as Request Handler as its actually handles the request by sending the response.
*/

/* 
// We can send the route handlers in an array & they will work exactly same
app.get(
    "/",
    [
        (req, res, next) => {
            console.log("Handeling route handler 1");
            // res.send("1st Response");
            next();
        },
        (req, res, next) => {
            console.log("Handeling route handler 2");
            // next();
            // res.send("2nd Response");
            next();
        },
    ],
    (req, res) => {
        console.log("Handeling route handler 3");
        res.send("3rd & final Response");
    },
);
*/

app.listen(3001, () => {
    console.log("App listening on port 3001");
});
