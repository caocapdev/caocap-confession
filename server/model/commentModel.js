const mongoose = require("./dbConnect");

const CommentSchema = mongoose.Schema(
  {
    commentName: String,
    commentContent: String,
    commentTime: String,
  },
  { collection: "comment" }
);

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;
