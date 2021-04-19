var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var booksRouter = require("./routes/books");
const db = require("./models");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware to serve up static files
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", booksRouter);

//async IIFE
(async () => {
  try {
    await db.sequelize.authenticate().then(() => {
      console.log("Connection has been established successfully");
    });
    await db.sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("404 Not Found");
  err.status = 404;
  err.message = "Sorry! The page you are looking for cannot be found.";
  next(err);
});

// 404 error handler
app.use((req, res, next) => {
  res.render("page-not-found", { err });
});

//global error handler
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    // set locals, only providing error in development
    res.locals.message =
      err.message || "Sorry! There was an unexpected error on the server.";
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // set status
    res.status(err.status || 500);
    console.log(err.status, err.message);
    // render the error page
    res.render("error", { err });
  }
});

module.exports = app;
