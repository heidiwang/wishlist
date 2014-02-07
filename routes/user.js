var app = require("../app");
var mongoose = require("mongoose");

exports.login_form = function (req, res) {
	res.render("login_form");
};

exports.new_user = function (req, res) {
	res.render("new_user");
};

exports.create_user = function (req, res) {
	var name = req.param("name");
	var new_user = new app.UserModel({user_name: name});

	new_user.save(function (err, new_user) {
		if (err) {
			console.log(err);
			res.redirect("/new_user");
		} else {
			req.session.user = new_user;
			res.redirect("/");
		}
	});
};

exports.login = function (req, res) {
	var name = req.param("name");

	app.UserModel.findOne({user_name: name}, function (err, found_user) {
		if (err) {
			console.log(err);
		} else if (!found_user) {
			console.log("login: !found_user");
			res.redirect("/login_form");
		} else {
			req.session.user = found_user;
			res.redirect("/");
		}
	});
};

exports.logout = function (req, res) {
	req.session.user = null;
	res.redirect("/");
};



exports.following = function (req, res) {
	app.UserModel
	.findById(req.session.user._id)
	.populate("following")
	.exec(function (err, user) {
		res.render("following", {
			wishes: user.following,
			user: req.session.user
		});
	});
};

exports.follow = function (req, res) {
	var wish_id = req.param("id");
	app.UserModel.findById(req.session.user._id, function (err, found_user) {
		if (err) {
			console.log(err);
		} else {
			found_user.following.push(wish_id);
			found_user.save(function (err, found_user) {
				if (err) {
					console.log(err);
				} else {
					res.send();
				} 
			});
		}
	});
};

exports.unfollow = function (req, res) {
	var wish_id = req.param("id");
	app.UserModel.findById(req.session.user._id, function (err, found_user) {
		if (err) {
			console.log(err);
		} else {
			var index = found_user.following.indexOf(mongoose.Types.ObjectId(wish_id));
			found_user.following.splice(index, 1);
			found_user.save(function (err, found_user) {
				if (err) {
					console.log(err);
				} else {
					res.send();
				}
			});
		}
	});
};