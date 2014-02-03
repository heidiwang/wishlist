$(".vote").click(function () {
	var div = $(this);
	if (div.attr("class") == "vote upvote") {
		$.getJSON("http://localhost:3000/upvote/" + $(this).attr("id"), function (data) {
			div.attr("class", "vote unvote");
			div.text("v " + data.wish.upvotes);
		});
	} else {
		$.getJSON("http://localhost:3000/unvote/" + $(this).attr("id"), function (data) {
			div.attr("class", "vote upvote");
			div.text("^ " + data.wish.upvotes);
		});
	}
});

$("#search").keyup(function () {
		$.getJSON("http://localhost:3000/search/" + $(this).val(), function (data) {
			console.log(data.result);
 		  $("#results").text(data.result);
	  });
});

$(".follow").click(function () {
	var div = $(this);
	if (div.attr("class") == "follow") {
		console.log(div);
		$.get("/follow/" + div.attr("id"), function (data) {
			div.attr("class", "follow unfollow");
			div.text("unfollow");
	  });
	} else {
		$.get("/unfollow/" + div.attr("id"), function (data) {
			div.attr("class", "follow");
			div.text("follow");
		});
	}
});