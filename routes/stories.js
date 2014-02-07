exports.view = function(req, res) {
	res.render("stories", {user: req.session.user});
}