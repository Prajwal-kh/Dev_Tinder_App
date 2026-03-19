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
