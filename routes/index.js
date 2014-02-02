var app = require("../app");
var WishModel = require("./wish");
var UserModel = require("./user");

/*
 * GET home page.
 */

exports.index = function(req, res){
	app.WishModel.find().sort({score: "desc"}).exec(function (err, wishes) {
		var feed = [];
		for (var i = 0; i < wishes.length; i++) {
			var voted = WishModel.has_voted(wishes[i]._id.toString(), req);
			var following = UserModel.is_following(wishes[i]._id, req);
			feed.push({wish: wishes[i], voted: voted, following: following});
			// if (WishModel.has_voted(wishes[i]._id.toString(), req)) {
			// 	feed.push({wish: wishes[i], voted: true});
			// } else{
			// 	feed.push({wish: wishes[i], voted: false});
			// }
		}
		res.render("index", {feed: feed, user: req.session.user});
	});
};