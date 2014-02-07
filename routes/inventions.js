exports.view = function(req, res) {
	res.render("inventions", {user: req.session.user});
}