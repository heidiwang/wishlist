var app = require("../app");
var Wish = require("./wish");

exports.index = function(req, res){

	app.WishModel.find().sort({score: "desc"}).exec(function (err, wishes) {

    if (req.session.user) {
      app.UserModel.findById(req.session.user._id, function (err, found_user) {
        if (err) {
          console.log(err);
        } else {
          var following = found_user.following;
          var voted = found_user.voted;
          var feed = [];

          for (var i = 0; i < wishes.length; i++) {
            feed.push({wish: wishes[i], 
                  following: contains_id(wishes[i]._id, following),
                      voted: contains_id(wishes[i]._id, voted)});
          }

          res.render("index", {user: req.session.user, feed: feed});
        }
      });
    } else {
      res.render("index", {wishes: wishes});
    }

		// var feed = [];
		// for (var i = 0; i < wishes.length; i++) {
		// 	var voted = Wish.has_voted(wishes[i]._id.toString(), req);

		// 	feed.push({wish: wishes[i], voted: voted});
		// }
		// res.render("index", {feed: feed, user: req.session.user});
	});
};

function contains_id (object_id, array) {
  for (var i = 0; i < array.length; i++) {
    if (object_id.equals(array[i])) {
      return true;
    }
  }
  return false;
};
