const mongoose = require("./dbConnect");

const StatSchema = mongoose.Schema(
  {
    statName: String,
    statNumber: Number,
  },
  { collection: "stat" }
);

const StatModel = mongoose.model("stat", StatSchema);

module.exports = StatModel;
