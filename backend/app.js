const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const app = express();

app.use("/", express.static("uploads"));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: [
        "http://localhost:5173", 
        "https://circle-verse.vercel.app/"
    ],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  if (req.query) req.query = mongoSanitize.sanitize({ ...req.query });
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
// app.all("*", (req, res, next) => {
//     return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
