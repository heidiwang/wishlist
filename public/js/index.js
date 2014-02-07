$(".vote").click(function () {
	var input = $(this);
	if (input.attr("class") == "btn btn-default vote-btn vote upvote") {
		$.getJSON("http://localhost:3000/upvote/" + input.attr("id"), function (data) {
			input.attr("class", "btn btn-default vote-btn vote unvote");
			input.attr("value", "Unvote");
			input.next().text(data.wish.upvotes);
		});
	} else {
		$.getJSON("http://localhost:3000/unvote/" + input.attr("id"), function (data) {
			input.attr("class", "btn btn-default vote-btn vote upvote");
			input.attr("value", "Vote")
			input.next().text(data.wish.upvotes);
		});
	}
});

$("#search").keyup(function () {
		if ($(this).val()) {
			$.getJSON("http://localhost:3000/search/" + $(this).val(), function (data) {
				console.log(data.result);
 		  $("#results").text(data.result);
	    });
		} else {
			$("#results").text("");
		}
});

$(".follow").click(function () {
	var button = $(this);
	if (button.attr("value") == "follow") {
		console.log(button);
		$.get("/follow/" + button.attr("id"), function (data) {
			button.attr("value", "unfollow");
			// button.text("unfollow");
	  });
	} else {
		$.get("/unfollow/" + button.attr("id"), function (data) {
			button.attr("value", "follow");
			// button.text("follow");
		});
	}
});