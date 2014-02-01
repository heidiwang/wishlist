var app = require("../app");
var WishModel = require("./wish");

/*
 * GET home page.
 */

exports.index = function(req, res){
	app.WishModel.find().sort({score: "desc"}).exec(function (err, wishes) {
		var feed = [];
		console.log("index: " + req.session.voted);
		for (var i = 0; i < wishes.length; i++) {
			console.log(wishes[i]);
			if (WishModel.has_voted(wishes[i]._id.toString(), req)) {
				feed.push({wish: wishes[i], voted: true});
			} else{
				feed.push({wish: wishes[i], voted: false});
			}
		}
		res.render("index", {feed: feed});
	});
};