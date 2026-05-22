import validator from "validator";

const validateSignupData = (data) => {
    const { firstName, lastName, email, password } = data;
    if (!firstName || !lastName) {
        throw new Error("Name is required");
    }
    if (firstName.length < 2 || firstName.length > 20) {
        throw new Error("First name should be between 2 to 20 characters");
    }
    if (lastName.length < 2 || lastName.length > 20) {
        throw new Error("Last name should be between 2 to 20 characters");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is not a valid email address");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
};

export default validateSignupData;

// It's better to validate data here in the route handler level before creating the user object and saving it into the database because if we do it in the schema level
// then it will only validate the data while creating a user not while updating so to enable it pass runValidator as true in update query but if we do it here then
// it will validate the data both while creating and updating a user.
