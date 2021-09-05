const mongoose = require("./dbConnect");

const PostSchema = mongoose.Schema(
  {
    postContent: String,
    postTime: String,
    postNumber: Number,
    commentId: [
      {
        type: String,
        ref: "comment",
      },
    ],
  },
  { collection: "post" }
);

const PostModel = mongoose.model("total", PostSchema);

module.exports = PostModel;
