var mongoose = require("mongoose");

mongoose.connect("mongodb connect link here", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = mongoose;
