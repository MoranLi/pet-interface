var express = require('express');
var weather = require('weather-js');
var request = require('request');

var app = express();

app.set("view engine","ejs");

var pet_data = "https://pet-weather.herokuapp.com";
var weather_url = "https://api.darksky.net/forecast/8343627ac58e5517bea291cc8f7435cf/";


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("pet server start");
});

app.get("/",function(req,res){
    request(pet_data,function(err,responce,body){
        if(err){
            console.log(err);
        }
        else{
            var datas = JSON.parse(body);
            res.render("main",{pets: datas});  
        }
    });
});

app.get("/pets/new",function(req,res){
    res.render("new");  
});

app.get("/pets/:id",function(req,res){
    request(pet_data.concat("/pets/",req.params.id),function(err, responce, body) {
        if(err){
            console.log(err);
        }
        else{
            var some = JSON.parse(body);
            var latitude = some[0].latitude;
            var longitude = some[0].longitude;
            request(weather_url.concat(latitude,",",longitude),function(err2,responce2,body2){
               if(err2){
                   console.log(err2);
               } 
               else{
                   var good = JSON.parse(body2);
                   var prob = good.currently.precipProbability;
                   var umbrella;
                   if(prob> 50){
                        umbrella = "Need Umbrella";
                        res.render("weather",{umbrella : umbrella});
                    }
                    else{
                        umbrella = "No Umbrella";
                        res.render("weather",{umbrella : umbrella});
                    }
               }
            });
        }
    });
});


