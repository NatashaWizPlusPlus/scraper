//Dependedncies
var express = require ("express");
var bodyparser = require ("body-parser");
var logger = require ("morgan");
var mongoose = require ("mongoose");

//Require the models

//Scraping Tools
var request = require ("request");
var cheerio = require ("cheerio");

//Set Mongoose to use the Javascript ES6 Promises
mongoose.Promise = Promise;

//Initialize Express
var app = express();

//Use morgan and body-parser
app.use(logger("dev"));
app.use(bodyparser.urlencoded({
    extended:false
}));

//Make public a static directory
app.use(express.static("public"));

//DB configuraton with mongoose
mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

//Show the mongoose errors when there are any
db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

//Let us add a message to the succensfull login of the db
db.once("open", function(){
    console.log("Mongoose connection was successful")
});
// 
// 
// 
// Here we will be handling the routes
// 
// 
// 

// Here goes the GET request to scrape the CNN web site
app.get("/scrape", function(req, res){
        // Let us grab the body of the html that will handle the request
        request("http://www.cnn.com/", function(error, response, html){
            //Let us load it into Cheerio with the $ selector
            var $ = cheerio.load(html);
            //grab every h3 article tag:
            S("cd__headline".each(function(i, element){

                //Save the empty result object
                var result = {};

                //Let us save this
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                //Using the Article model, create the entry
                // Pass the result object to the entry (title and link)
                var entry = new Article(result);


                // Save entry to db
                entry.save(function(err, doc){
                    //Log the errors
                    if(err){
                        console.log(err);
                    }
                    //Or log the doc
                    else{
                        console.log(doc);
                    }
                });

            });
        });

        //Getting the article that we scrapped from MongoDB

})