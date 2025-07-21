const AppError = require("../utils/appError");

const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("You are not authorized to perform this action", 403));
        }
        next();
    };
};

module.exports = restrictTo;
