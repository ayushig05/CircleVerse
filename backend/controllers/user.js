const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const AppError = require("../utils/appError");
const getDataUri = require("../utils/dataUri");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.getProfile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select(
        "-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
    ).populate({
        path: 'posts',
        options: { sort: { createdAt: -1 } },
        match: (req.user?.role === 'celebrity') ? {} : { _id: { $exists: true } }
    }).populate({
        path: "savedPosts",
        options: { sort: { createdAt: -1 } },
        match: (req.user?.role === 'celebrity') ? {} : { _id: { $exists: true } }
    });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

exports.editProfile = catchAsync(async(req, res, next) => {
    const userId = req.user.id;
    const { bio } = req.body;
    const profilePicture = req.file;
    const editableFields = ["bio"];
    const requestFields = Object.keys(req.body);
    for (let field of requestFields) {
        if (!editableFields.includes(field)) {
            return next(new AppError(`You are not allowed to update the field: ${field}`, 403));
        }
    }
    let cloudResponse;
    if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        cloudResponse = await uploadToCloudinary(fileUri);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (bio) {
        user.bio = bio;
    }
    if (profilePicture) {
        user.profilePicture = cloudResponse.secure_url;
    }
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
        message: "Profile Updated Successfully",
        status: "success",
        data: {
            user,
        },
    });
});

exports.suggestedUser = catchAsync(async(req, res, next) => {
    const loginUserId = req.user.id;
    const users = await User.find({ 
        _id: { $ne: loginUserId }, 
        role: "celebrity" 
    }).select(
        "-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
    );
    res.status(200).json({
        status: "success",
        data: {
            users,
        },
    });
});

exports.followUnfollow = catchAsync(async(req, res, next) => {
    const loginUserId = req.user._id;
    const targetUserId = req.params.id;
    if (loginUserId.toString() === targetUserId) {
        return next(new AppError("You cannot follow/unfollow yourself", 400));
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        return next(new AppError("User not found", 404));
    }
    if (targetUser.role !== "celebrity") {
        return next(new AppError("You can only follow users with celebrity role", 403));
    }
    const isFollowing = targetUser.followers.includes(loginUserId);
    if (isFollowing) {
        await Promise.all([
            User.updateOne(
                { _id: loginUserId },
                { $pull: { following: targetUserId } }
            ),
            User.updateOne(
                { _id: targetUserId },
                { $pull: { followers: loginUserId } }
            ),
        ]);
    } else {
        await Promise.all([
            User.updateOne(
                { _id: loginUserId },
                { $addToSet: { following: targetUserId } }
            ),
            User.updateOne(
                { _id: targetUserId },
                { $addToSet: { followers: loginUserId } }
            ),
        ]);;
    }
    const updatedLoggedInUser = await User.findById(loginUserId).select("-password");
    res.status(200).json({
        message: isFollowing ? "Unfollowed Successfully" : "Followed Sucessfully",
        status: "success",
        data: {
            user: updatedLoggedInUser,
        },
    });
});

exports.getMe = catchAsync(async(req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new AppError("User not Authenticated", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Authenticated User",
        data: {
            user,
        },
    });
});
