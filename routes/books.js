var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// /* GET home route and redirect to /books */
// router.get(
//   "/",
//   asyncHandler(async (req, res, next) => {
//     res.redirect("/books");
//   })
// );

/* GET full list books */
router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();
    res.render("/books", { books });
  })
);

module.exports = router;
