var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/books");
});

module.exports = router;
