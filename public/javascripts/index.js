// $(document).ready(function () {
// 	console.log("Hello world");
// });

$(".upvote").click(function () {
	var div = $("#" + $(this).attr("id"));
	if (div.attr("class") == "upvote") {
		$.getJSON("http://localhost:3000/upvote/" + $(this).attr("id"), function (data) {
			if (data.success) {
				div.attr("class", "unvote");
				div.text("v " + data.wish.upvotes);
			}
		});
	} else {
		$.getJSON("http://localhost:3000/unvote/" + $(this).attr("id"), function (data) {
			if (data.success) {
				div.attr("class", "upvote");
				div.text("^ " + data.wish.upvotes);
			}
		});
	}
});