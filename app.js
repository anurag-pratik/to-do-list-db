const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

const url =
  "mongodb+srv://anurag-pratik:" +
  process.env.MDB_PASS +
  "@to-do-list-cluster1.3bch2.mongodb.net/to-do-list?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
  itemContent: String,
};

const Item = mongoose.model("item", itemSchema);

app.get("/", function (req, res) {
  var now = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var date = now.toLocaleDateString("en-US", options);

  Item.find({}, function (err, foundItems) {
    res.render("index", { date: date, foundItems: foundItems });
  });
});

app.post("/", function (req, res) {
  var content = req.body.listInput;
  var newItem = new Item({
    itemContent: content,
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  var obid = req.body.checkBox.trim();

  Item.findByIdAndRemove(obid, function (err, doc) {
    if (err) console.log(err);
    else console.log("Deleted Successfully: ", doc);
  });

  res.redirect("/");
});

app.listen(3000);
