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
    let book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  })
);

/* GET individual book */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book });
  })
);

/* POST update book */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.update(req.params.id);
    res.redirect("/books" + book.id);
  })
);

module.exports = router;
