
/**
 * Module dependencies.
 */

 var express = require("express");
 var routes = require("./routes");
 var wish = require("./routes/wish");
 var user = require("./routes/user");
 var http = require("http");
 var path = require("path");

 var mongoose = require("mongoose");

 var app = express();

/* Initialize sessions */
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env")) {
	app.use(express.errorHandler());
}

init_mongoose();
define_schemas();
define_routes();



http.createServer(app).listen(app.get("port"), function(){
	console.log("Express server listening on port " + app.get("port"));
});

function init_mongoose () {
	mongoose.connect("mongodb://10.31.12.51/test");
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function callback () {
		console.log("connected to database");
	});
};

function define_schemas () {
	var Schema = mongoose.Schema;
	
	var story_schema = Schema({
		text: {type: String, unique: true, required: true},
		upvotes: Number,
		second_created: Number
	});

	var invention_schema = Schema({
		title: {type: String, unique: true, required: true},
		description: {type: String, unique: true, required: true},
		upvotes: Number,
	});

	var wish_schema = Schema({
		text: {type: String, unique: true, required: true},
		upvotes: Number,
		second_created: Number,
		score: Number,
		inventions: [{type: Schema.Types.ObjectId, ref: "Invention"}],
		stories: [{type: Schema.Types.ObjectId, ref: "Story"}]
	});

	var user_schema = Schema({
		user_name: {type: String, unique: true, required: true},
		voted: [{type: Schema.Types.ObjectId, ref: "Wish"}],
		following: [{type: Schema.Types.ObjectId, ref: "Wish"}]
	});

	var Wish = mongoose.model("Wish", wish_schema);
	var User = mongoose.model("User", user_schema);

	exports.WishModel = Wish;
	exports.UserModel = User;
};

function define_routes () {
	app.get("/", routes.index);
	app.post("/create_wish", wish.create);
	app.get("/upvote/:id", wish.upvote);
	app.get("/unvote/:id", wish.unvote);
	app.get("/login_form", user.login_form);
	app.get("/new_user", user.new_user);
	app.get("/search/:query", wish.search);
	app.post("/login", user.login);
	app.post("/create_user", user.create_user);
	app.get("/logout", user.logout);
	app.get("/following", user.following);
	app.get("/follow/:id", user.follow);
	app.get("/unfollow/:id", user.unfollow);
	app.get("/wish/:id", wish.view);
};
