
/**
 * Module dependencies.
 */

 var express = require("express");
 var routes = require("./routes");
 var wish = require("./routes/wish");
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
	mongoose.connect("mongodb://localhost/test");
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function callback () {
		console.log("connected to database");
	});
};

function define_schemas () {
	var Schema = mongoose.Schema;

	var wish_schema = Schema({
		text: String,
		upvotes: Number,
		second_created: Number,
		score: Number
	});

	var Wish = mongoose.model("Wish", wish_schema);
	exports.WishModel = Wish;
};

function define_routes () {
	app.get("/", routes.index);
	app.post("/create_wish", wish.create);
	app.get("/upvote/:id", wish.upvote);
	app.get("/unvote/:id", wish.unvote);
};
