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
	app.WishModel.findById(wish_id, function (err, found_wish) {
		if (err) {
			console.log(err);
		} else {
			found_wish.upvotes++;
			found_wish.save(function (err, found_wish) {
				if (err) {
					console.log(err);
				} else {
					add_voted (wish_id, req);
					res.send({success: true, wish: found_wish});
				}
			});
		}
	});
};

exports.unvote = function (req, res) {
	var wish_id = req.param("id");
	app.WishModel.findById(wish_id, function (err, found_wish) {
		if (err) {
			console.log(err);
		} else {
			found_wish.upvotes--;
			found_wish.save(function (err, found_wish) {
				if (err) {
					console.log(err);
				} else {
					remove_voted (wish_id, req);
					res.send({success: true, wish: found_wish});
				}
			});
		}
	}); 
};

function add_voted (wish_id, req) {
	if (!req.session.voted) {
		req.session.voted = [];
	} 
	req.session.voted.push (wish_id);
	console.log("add_voted: " + req.session.voted);
};

function remove_voted (wish_id, req) {
	var index = req.session.voted.indexOf (wish_id);
	req.session.voted.splice (index, 1);
	console.log("remove_voted: " + req.session.voted);
};

/* Returns true if the session hasn't already voted on this wish, 
false if they already have */

function has_voted (wish_id, req) {
	console.log("has_voted: wish_id = " + wish_id + " voted" + req.session.voted);
	if (!req.session.voted) {
		/* Hasn't voted on anything yet */
		return false;
	} else if (req.session.voted.indexOf(wish_id) == -1) {
		console.log("2");
		/* Hasn't voted on this wish yet */
		return false;
	} else {
		console.log("3");
		/* Already voted on this wish */
		return true;
	}
};

exports.has_voted = has_voted;