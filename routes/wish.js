var app = require("../app");

var second_start = new Date(2005, 11, 8, 7, 46, 43, 0).getTime();
var DECAY_FACTOR = 45000;

var timer = setInterval(function () {update_score_all()}, 1000);

exports.create = function (req, res) {
	var wish_text = req.param("wish");

	var time = new Date().getTime();
	var score = (time - second_start) / DECAY_FACTOR;
	
	var new_wish = new app.WishModel({text: wish_text, upvotes: 0, second_created: time, score: score});
	new_wish.save(function (err, new_wish) {
		if (err) {
			console.log(err);
			return;
		}
	});

	console.log(new_wish);
	res.redirect("/");
};

exports.upvote = function (req, res) {
	var wish_id = req.param("id");
	app.WishModel.findById(wish_id, function (err, found_wish) {
		if (err) {
			console.log(err);
		} else {
			found_wish.upvotes++;
			update_score(found_wish);
			found_wish.save(function (err, found_wish) {
				if (err) {
					console.log(err);
				} else {
					add_voted (wish_id, req);
					console.log(found_wish);
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
			update_score(found_wish);
			found_wish.save(function (err, found_wish) {
				if (err) {
					console.log(err);
				} else {
					remove_voted (wish_id, req);
					console.log(found_wish);
					res.send({success: true, wish: found_wish});
				}
			});
		}
	}); 
};

exports.search = function (req, res) {
	var query = req.param("query");
	console.log(query);
	app.WishModel.find(function (err, wishes) {
		var result = [];
		for (var i = 0; i < wishes.length; i++) {
			console.log(wishes[i].text);
			if (wishes[i].text.indexOf(query) != -1) {
				result.push(wishes[i].text);
			}
		}
		res.send({result: result});
	})
};

function update_score_all () {
	var wishes = app.WishModel.find();
	for (var i = 0; i < wishes.length; i++) {
		update_score(wishes[i]);
	}
};

function update_score (wish) {
	wish.score = Math.log(wish.upvotes + 1) + (wish.second_created - second_start) / DECAY_FACTOR;
};


function add_voted (wish_id, req) {
	if (!req.session.voted) {
		req.session.voted = [];
	} 
	req.session.voted.push (wish_id);
};

function remove_voted (wish_id, req) {
	var index = req.session.voted.indexOf (wish_id);
	req.session.voted.splice (index, 1);
};

/* Returns true if the session hasn't already voted on this wish, 
false if they already have */

function has_voted (wish_id, req) {
	if (!req.session.voted) {
		/* Hasn't voted on anything yet */
		return false;
	} else if (req.session.voted.indexOf(wish_id) == -1) {
		/* Hasn't voted on this wish yet */
		return false;
	} else {
		/* Already voted on this wish */
		return true;
	}
};

exports.has_voted = has_voted;