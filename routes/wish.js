var app = require("../app");

exports.create = function (req, res) {
	var wish_text = req.param("wish");
	
	var new_wish = new app.WishModel({text: wish_text, upvotes: 0});
	new_wish.save(function (err, new_wish) {
		if (err) {
			console.log(err);
			return;
		}
	});

	res.redirect("/");
};

exports.upvote = function (req, res) {
	var wish_id = req.param("id");
	if (check_voted(wish_id, req)) {
		app.WishModel.findOne({_id: wish_id}, function (err, found_wish) {
			if (err) {
				console.log(err);
			} else {
				found_wish.upvotes++;
				found_wish.save(function (err, found_wish) {
					if (err) {
						console.log(err);
					} else {
						res.send({success: true, wish: found_wish});
					}
				});
			}
		});
	} else {
		res.send({success: false});
	}
};

exports.unvote = function (req, res) {
	var wish_id = req.param("id");
	if (!check_voted(wish_id, req)) {
		var index = req.session.voted.indexOf(wish_id);
		req.session.voted.splice(index, 1); //Remove the wish
		
		app.WishModel.findById(wish_id, function (err, found_wish) {
			if (err) {
				console.log(err);
			} else {
				found_wish.upvotes--;
				found_wish.save(function (err, found_wish) {
					if (err) {
						console.log(err);
					} else {
						res.send({success: true, wish: found_wish});
					}
				});
			}
		});
	} else {
		res.send({success: false});
	}
};

/* Returns true if the session hasn't already voted on this wish, 
	 false if they already have */

function check_voted (wish_id, req) {
	if (!req.session.voted) {
		/* Hasn't voted on anything yet */
		req.session.voted = [];
		req.session.voted.push(wish_id);
		return true;
	} else if (req.session.voted.indexOf(wish_id) == -1) {
		/* Hasn't voted on this wish yet */
		req.session.voted.push(wish_id);
		return true;
	} else {
		/* Already voted on this wish */
		return false;
	}
}