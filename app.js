var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const db = require("./db");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var usersFollowerRouter = require("./routes/followers.router");
var userSupport = require("./routes/support,.router");
var feedback = require("./routes/feedbacks.router");
var level = require("./routes/level.router");
var live = require("./routes/live.router");
var admin = require("./routes/admin.router");
var notification = require('./routes/notification.router')
var liveComments = require('./routes/liveComments.router')
const gift=require('./routes/gift.router')

var app = express();
db.dbConnection();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())


app.use(
  "/profile_images",
  express.static(path.join(__dirname, "public/profile_images"))
); // PROFILE IMAGES

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/user/follower", usersFollowerRouter);
app.use("/support", userSupport);
app.use("/feedback", feedback);
app.use("/level", level);
app.use("/live", live);
app.use("/admin", admin);
app.use("/notification", notification);
app.use("/liveComments", liveComments);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// =============== IMAGES STATIC PATHS =============== //
app.use(
  "/profile_images",
  express.static(path.join(__dirname, "public/profile_images"))
); // PROFILE IMAGES
app.use("/posts", express.static(path.join(__dirname, "public/posts"))); // PROFILE IMAGES
app.use("/stores", express.static(path.join(__dirname, "public/store"))); // PROFILE IMAGES

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
