
const serverless = require("serverless-http");
const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/my-function', function(req, res){
   res.sendFile(__dirname + '/index.html');    

});
app.post("/my-function", function(req, res){
const startDate = req.body.startdate;
const endDate = req.body.enddate;
const apiKey = process.env.apiKey;
const url = "https://api.nasa.gov/neo/rest/v1/feed?start_date="+ startDate+"&end_date="+ endDate+"&api_key="+apiKey;
  https.get(url, "JSON",function(response){
      let data;
           response.on("data",function(chunck){
              if (!data) {
                  data = chunck;
                } else {
                  data += chunck;
                }
              });
          
              response.on("end", function() {
                const earthData=JSON.parse(data);
                
   
                
             
                          const id = earthData.near_earth_objects[endDate][0].id;
                          const minMeters= earthData.near_earth_objects[endDate][0].estimated_diameter.meters.estimated_diameter_min;
                        const maxMeters = earthData.near_earth_objects[endDate][0].estimated_diameter.meters.estimated_diameter_max;
                          const name = earthData.near_earth_objects[endDate][0].name;
                          const velocity = earthData.near_earth_objects[endDate][0].close_approach_data[0].relative_velocity.kilometers_per_hour;
                          const hazarouds = earthData.near_earth_objects[endDate][0].is_potentially_hazardous_asteroid;
                          res.send("<h1>Near Earth Objects</h1><ul><li>The ID is " + id + "</li><li>The name of the Object is " + name +"</li><li>The object hazardous is "+ hazarouds + "</li><li>The diameter in meters are "+ minMeters + " minimum and "+ maxMeters + " maximum </li><li>The velocity of the object in Kilometres per hour is "+ velocity + "</li></ul>");  
                 
                                     
      });
  });
});



module.exports.handler = serverless(app);


        
  
