const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            maxlength: [2200, "Caption should be less than 2200 characters"],
            trim: true,
        },
        image: {
            url: {
                type: String,
                required: false,
            },
            publicId: {
                type: String,
                required: false,
            },
        },
        video: {
            url: {
                type: String,
                required: false,
            },
            publicId: {
                type: String,
                required: false,
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "User ID is required",
            ],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
