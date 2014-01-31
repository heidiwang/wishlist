var app = require("../app");

/*
 * GET home page.
 */

exports.index = function(req, res){
	app.WishModel.find().sort({upvotes: "desc"}).exec(function (err, wishes) {
		res.render("index", {feed: wishes});
	});
	// app.WishModel.find(function (err, wishes) {
	// 	if (err) {
	// 		console.log(err);
	// 		return;
	// 	}
	// 	res.render("index", {feed: wishes});
	// });
};