// $(document).ready(function () {
// 	console.log("Hello world");
// });

$(".upvote").click(function () {
	$.getJSON("http://localhost:3000/upvote/" + $(this).attr("id"), function (data) {
		console.log(data);
		if (data.success) {
			$("#" + data.wish._id + ".upvote").text("^ " + data.wish.upvotes);
		}
	});
});

$(".unvote").click(function () {
	$.getJSON("http://localhost:3000/unvote/" + $(this).attr("id"), function (data) {
		if (data.success) {
			$("#" + data.wish._id + ".upvote").text("^ " + data.wish.upvotes);
		}
	});
});