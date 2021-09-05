const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const PostModel = require("./model/postModel");
const CommentModel = require("./model/commentModel");
const StatModel = require("./model/statModel");

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/post", async function (req, res) {
  try {
    let data = await PostModel.find({})
      .sort({ postNumber: -1 })
      .populate("commentId");
    console.log(data);
    res.json({
      mess: "lay data thanh cong",
      data: data,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      mess: "loi server",
      err: err,
      status: 500,
    });
  }
});

const postLimiter = rateLimit({
  windowMs: 60 * 60 * 24000,
  max: 1,
  mess: "",
  handler: function (req, res /*next*/) {
    res.json({
      mess: "Cậu chỉ có thể đăng 1 confession 1 ngày",
      toastr: "warning",
      status: 200,
    });
  },
});

app.post("/post/new", postLimiter, async function (req, res) {
  try {
    let number = await StatModel.findOne({ statName: "total" });
    let check = await PostModel.findOne({ postContent: req.body.content });
    if (check) {
      res.json({
        mess: "Bài này trùng rồi áa, cậu đăng lại nha:(",
        toastr: "warning",
        status: 200,
      });
    } else {
      number = number.statNumber;
      console.log(req.body);
      let data = await PostModel.create({
        postContent: req.body.content,
        postNumber: number,
        postTime: new Date().getTime(),
      });
      await StatModel.updateOne(
        { statName: "total" },
        { $inc: { statNumber: 1 } }
      );
      res.json({
        mess: "Post bài mới thành công",
        data: data,
        toastr: "success",
        status: 200,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      mess: "loi server",
      err: err,
      status: 500,
    });
  }
});

const cmtLimiter = rateLimit({
  windowMs: 60 * 60 * 500,
  max: 5,
  mess: "",
  handler: function (req, res /*next*/) {
    res.json({
      mess: "Bạn chỉ được đăng 5 comment trong 30 phút",
      toastr: "warning",
      status: 200,
    });
  },
});

app.post("/post/comment", cmtLimiter, async function (req, res) {
  try {
    let data = await CommentModel.create({
      commentName: req.body.name,
      commentContent: req.body.content,
      commentTime: new Date().getTime(),
    });
    console.log(data);
    await PostModel.updateOne(
      { _id: req.body.id },
      { $push: { commentId: { $each: [data._id], $position: 0 } } }
    );
    res.json({
      mess: "Đăng comment thành công",
      toastr: "success",
      data: data,
      status: 500,
    });
  } catch (err) {
    console.log(err);
    res.json({
      mess: "loi server",
      err: err,
      status: 500,
    });
  }
});

app.listen(3000);
