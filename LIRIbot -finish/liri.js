require("dotenv").config();
var keys = require("./keys.js");
var http = require('http');
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var omdbApi = require('omdb-client');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var nodeArgs = process.argv;

var userCommand = process.argv[2];
var title = "";
var movieName = "";
var j = nodeArgs.length;

function searchTitle() {

    if (j >= 4) {
        for (var i = 3; i < nodeArgs.length; i++) {

            title = title + " " + nodeArgs[i];
            movieName = movieName + " " + nodeArgs[i];

        }
    }
     else {
        title = "the sign";
        movieName = "Mr. Nobody";
        console.log("default song or movie");
    }

};

function twitterCall() {
    client.get("search/tweets", { q: "james_illius" }, function (err, tweets, response) {
        if (err) {
            return console.log('Error occurred: ' + err);

        }
        for (var i = 0; i < tweets.statuses.length; i++) {
            console.log(tweets.statuses[i].text);
        }
    });
}


function spotifyCall() {
    spotify.search({ type: 'track', query: title }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artists: " + data.tracks.items[0].artists[0].name);
        console.log("Album :" + data.tracks.items[0].album.name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Song Name: " + title);

    });
}

function omdbCall() {

    var params = {
        apiKey: 'trilogy',
        query: movieName,
        title: movieName

    }
    omdbApi.get(params, function (err, data) {


        if (err) {
            console.log(err);

        }
        else {


            console.log("Title: " + data.Title);
            console.log("Released: " + data.Released);
            console.log("imdbRating: " + data.imdbRating);
            console.log("RottenTomatoes: " + data.Metascore);
            console.log("Country: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Cast: " + data.Actors);
            console.log("Plot: " + data.Plot);

        }

    });

};

function randomCalls() {

    fs.readFile("random.txt", "utf8", function (err, data){
        if(err){
            console.log(err);
        }

 

        var dataArr = data.split(",")
        title = dataArr[1];
   
        
        spotifyCall();

    })

};

switch (userCommand) {
    case "my-tweets":

        twitterCall();
        break;

    case "spotify-this-song":


        searchTitle();
        spotifyCall();
        break;

    case "movie-this":
        searchTitle();
        omdbCall();
        break;

    case "do-what-it-says":
    randomCalls();
        break;
}
