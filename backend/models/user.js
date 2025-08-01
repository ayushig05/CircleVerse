const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add your username"],
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 30,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please provide your password"],
            minLength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (element) {
                    return element === this.password;
                },
                message: "Passwords are not the same",
            },
        },
        role: {
            type: String,
            enum: ["celebrity", "public"],
            required: true,
            default: "public",
        },
        profilePicture: {
            type: String,
        },
        bio: {
            type: String,
            maxLength: 150,
            default: "",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            
            },
        ],
        savedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },
        resetPasswordOTP: {
            type: String,
            default: null,
        },
        resetPasswordOTPExpires: {
            type: Date,
            default: null,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (userPassword, databasePassword) {
    return await bcrypt.compare(userPassword, databasePassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
