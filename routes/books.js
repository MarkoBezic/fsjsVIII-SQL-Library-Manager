var express = require("express");
var router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");

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
    res.redirect("/books/page/1");
  })
);

router.get(
  "/page/:page",
  asyncHandler(async (req, res) => {
    const numberOfPages = await Book.findAll().then((data) => {
      let result = Math.ceil(data.length / 5);
      return result;
    });
    console.log(numberOfPages);
    const paginatedBooks = await Book.findAll({
      offset: (req.params.page - 1) * 5,
      limit: 5,
    });
    res.render("books", { books: paginatedBooks, pages: numberOfPages });
  })
);

/* GET paginated book listing */
/// todo

/* Post searched books listing */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: `${req.body.search}`,
            },
          },
          {
            author: {
              [Op.substring]: `${req.body.search}`,
            },
          },
          {
            genre: {
              [Op.substring]: `${req.body.search}`,
            },
          },
          {
            year: {
              [Op.substring]: `${req.body.search}`,
            },
          },
        ],
      },
    });
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
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book });
    } else {
      const err = new Error("404 Not Found");
      err.status = 404;
      err.message = "Sorry! The page you are looking for cannot be found.";
      next(err);
    }
  })
);

/* POST update book */
router.post(
  "/:id",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        const err = new Error("404 Not Found");
        err.status = 404;
        err.message = "Sorry! The page you are looking for cannot be found.";
        next(err);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("update-book", { book, errors: error.errors });
      } else {
        throw error;
      }
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
      next(err);
    }
  })
);

module.exports = router;
