toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + 99999 * 365 * 24 * 60 * 60);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).ready(function () {
  let val = getCookie("username");
  $.ajax({
    type: "POST",
    url: "/post",
  }).then(function (data) {
    for (let i = 0; i < data.data.length; i++) {
      let time = new Date(parseInt(data.data[i].postTime));
      let day = time.getDate();
      let month = time.getMonth() + 1;
      let year = time.getFullYear();
      $(".cfs-container").append(`
      <div class="cfs-item ${data.data[i]._id}">
      <div class="cfs-order">#cfs${data.data[i].postNumber}</div>
      <span class="cfs-post-time">${day}-${month}-${year}</span>
      <div class="cfs-content">
      ${data.data[i].postContent.replace(/(?:\r\n|\r|\n)/g, "<br>")}
      </div>
      <div id="${data.data[i]._id}" class="cfs-comment ${i}">
        <span class="cfs-comment-heading">Bình luận</span>
        <div class="cfs-comment-user">
          <span class="input-label">Tên</span><br />
          <input type="text" class="cfs-user-comment-name input" value="${val}"/><br />
          <span class="input-label">Nội dung bình luận</span><br />
          <textarea class="cfs-user-comment-text input"></textarea>
          <button class="cfs-user-comment-post">Đăng</button>
        </div>
        <div class="border-bottom"></div>
        <div class="cfs-comment-container ${i}"></div>
      </div>
    </div>
      `);
      for (let j = 0; j < data.data[i].commentId.length; j++) {
        let cmtTime = new Date(parseInt(data.data[i].commentId[j].commentTime));
        let cmtDay = cmtTime.getDate();
        let cmtMonth = cmtTime.getMonth() + 1;
        let cmtYear = cmtTime.getFullYear();
        let cmtMinute =
          (cmtTime.getMinutes() < 10 ? "0" : "") + cmtTime.getMinutes();
        let cmtHour = (cmtTime.getHours() < 10 ? "0" : "") + cmtTime.getHours();
        $(".cfs-comment-container." + i).append(`
        <div class="cfs-comment-item">
            <span class="cfs-comment-name">${
              data.data[i].commentId[j].commentName
            } </span>
            <span class="cfs-comment-content"
            >${data.data[i].commentId[j].commentContent.replace(
              /(?:\r\n|\r|\n)/g,
              "<br>"
            )}</span>
            <span class="cfs-comment-post-time">${cmtDay}-${cmtMonth}-${cmtYear} | ${cmtHour}:${cmtMinute}</span>
        </div>
        `);
      }
    }
  });
});

$(".cfs-post").on("click", function () {
  if ($(".cfs-input-text").val().trim() == "") {
    toastr["warning"]("Đừng để trống gì nhaaa ^^");
  } else {
    $.ajax({
      type: "POST",
      url: "/post/new",
      data: {
        content: $(".cfs-input-text").val().trim(),
      },
    })
      .then(function (data) {
        toastr[data.toastr](data.mess);
        if (data.toastr != "warning") {
          location.reload();
        }
      })
      .catch(function (err) {
        toastr["error"]("Lỗi server", err.err);
      });
  }
});

$(document).on("click", ".cfs-user-comment-post", function () {
  setCookie("username", $(".cfs-user-comment-name").val());
  let ele = $(this).parent().parent().children(".cfs-comment-container");
  if (
    $(this).parent().children(".cfs-user-comment-name").val().trim() == "" ||
    $(this).parent().children(".cfs-user-comment-text").val().trim() == ""
  ) {
    toastr["warning"]("Đừng để trống gì nhaaa ^^");
  } else {
    $.ajax({
      type: "POST",
      url: "/post/comment",
      data: {
        name: $(this).parent().children(".cfs-user-comment-name").val().trim(),
        content: $(this)
          .parent()
          .children(".cfs-user-comment-text")
          .val()
          .trim(),
        id: $(this).parent().parent().attr("id"),
      },
    })
      .then(function (data) {
        toastr[data.toastr](data.mess);
        if (data.toastr == "success") {
          let cmtTime = new Date(parseInt(data.data.commentTime));
          let cmtDay = cmtTime.getDate();
          let cmtMonth = cmtTime.getMonth() + 1;
          let cmtYear = cmtTime.getFullYear();
          let cmtMinute =
            (cmtTime.getMinutes() < 10 ? "0" : "") + cmtTime.getMinutes();
          let cmtHour =
            (cmtTime.getHours() < 10 ? "0" : "") + cmtTime.getHours();
          ele.prepend(`
        <div class="cfs-comment-item">
        <span class="cfs-comment-name">${data.data.commentName}</span>
        <span class="cfs-comment-content"
        >${data.data.commentContent.replace(/(?:\r\n|\r|\n)/g, "<br>")}</span>
        <span class="cfs-comment-post-time">${cmtDay}-${cmtMonth}-${cmtYear} | ${cmtHour}:${cmtMinute}</span>
        </div>
        `);
        }
      })
      .catch(function (err) {
        toastr["error"]("Lỗi server", err.err);
      });
  }
});
