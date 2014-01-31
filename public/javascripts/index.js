// $(document).ready(function () {
// 	console.log("Hello world");
// });

$(".vote").click(function () {
	console.log("clicked");	
	var div = $("#" + $(this).attr("id"));
	if (div.attr("class") == "vote upvote") {
		$.getJSON("http://localhost:3000/upvote/" + $(this).attr("id"), function (data) {
			if (data.success) {
				div.attr("class", "vote unvote");
				div.text("v " + data.wish.upvotes);
			}
		});
	} else {
		$.getJSON("http://localhost:3000/unvote/" + $(this).attr("id"), function (data) {
			if (data.success) {
				div.attr("class", "vote upvote");
				div.text("^ " + data.wish.upvotes);
			}
		});
	}
});