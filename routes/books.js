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

/* GET books listing */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    console.log(books);
    res.render("books", { books });
  })
);

/* GET new book form */
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("new-book");
  })
);

/* POST new book record */
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("form-error", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

/* GET individual book */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book });
    } else {
      const err = new Error("404 Not Found");
      err.status = 404;
      err.message = "Sorry! The page you are looking for cannot be found.";
      res.render("page-not-found", { err });
    }
  })
);

/* POST update book */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = new Error("404 Not Found");
      err.status = 404;
      err.message = "Sorry! The page you are looking for cannot be found.";
      res.render("page-not-found", { err });
    }
  })
);

/* POST delete book */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      const err = new Error("404 Not Found");
      err.status = 404;
      err.message = "Sorry! The page you are looking for cannot be found.";
      res.render("page-not-found", { err });
    }
  })
);

module.exports = router;
