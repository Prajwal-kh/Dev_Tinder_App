import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 8,
            maxLenght: 20,
        },
        lastName: String,
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                // this validate function will only validate the data while creating a user not while updating so to enable it pass runValidator as true in update query
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
        about: {
            type: String,
            default: "A software developer who wants to collaborate",
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 5) {
                    throw new Error("Skills should not be more than 5");
                }
            },
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userSchema);

export default User;
