"use strict";

// Load our modules
var fs = require('fs'),
  tabletojson = require('tabletojson'),
  json2csv = require('json2csv'),
  cheerio = require('cheerio'),
  colors = require('colors');

// Set defaults
var defaults = {
  "path" : "process",
  "url" : "www.coolgithubprojects.com",
  "dest" : "dest",
  "format" : "csv"
};

// Set theme for output
colors.setTheme({
  info: 'green',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  data: 'grey'
});

// MARK : Main functions. Part of export
var convert = (path, dest, format, tableId) => {

  // Validate our inputs
  var validate = new Promise((resolve, reject) => {
    let inputs = { "path" : path, "dest" : dest, "format" : format };

    _validateArguments(inputs, (options) => {
      if(options) {
        resolve(options);
      } else {
        reject("Unable to validate arguments");
      }
    });

  });

  // Validate paths
  validate.then((options) => {

    // Process
    var process = new Promise((resolve, reject) => {

      _validatePaths(options, (status) => {
        if(status){
          resolve(options);
        } else {
          reject("Unable to validate paths.");
        }
      });
    });

    // Process our data and save it
    process.then((options) => {
      _processData(options, (status) => {
        console.log("Last promise ", status);
      })
    },
    (error) => {
      let err = "Something went wrong during processing : " + error;
      console.log((err).error);
    });

  },
  (error) => {
    let err = "Something went wrong during validation : " + error;
    console.log((err).error);
  })
}

exports.convert = convert;


var convertUrl = (url, dest, tableId) {


}

exports.convertUrl = convertUrl

// MARK : Supportive functions
function _validateArguments(options, cb){
  // Validate and prepare our arguments

  //If path is not given kick in defaults
  if(!options.path){
    options.path = __dirname+"\\"+defaults.path;
    console.log(("Warning: No path specified. Setting it to " + options.path).warn);
  }

  // Do the same for dest
  if(!options.dest){
    options.dest = __dirname+"\\"+defaults.dest;
    console.log(("Warning: No destination specified. Setting it to " + options.dest).warn);
  }

  // Set format type
  options.format = (!options.format) ? defaults.format : options.format;
  cb(options);
}

function _validatePaths(options, cb){

  fs.readdir(__dirname, function(err, files){
    if(err) throw err;

    // Check if path exists if calling from convert
    if (options.path){
      // Verify path
      var pathIsThere = files.filter(function(obj){
        return obj === options.path;
      });

      if(pathIsThere.length === 0){
        var err = "Path to process HTML files not there. Path is set to " + options.path;
        console.log((err).error);
        cb(null);
      }
    }

    // Verify dest
    var destIsThere = files.filter(function(obj){
      return obj === options.dest;
    });

    // If not found let us create
    if(destIsThere.length === 0){
      console.log("Creating destination folder".warn);
      fs.mkdirSync(options.dest);
      cb("done");
    } else {
      cb("done");
    }
  });
}

function _processData(options, cb){

  // Parse through each and find html file
  fs.readdir(options.path, function(err, files){

    var htmlfiles = files.filter(function(obj){
      return (obj.match(".html")  !== null);
    });

    // Process each HTML
    htmlfiles.forEach(function(file){

      var info = "Working on " + file;
      var filePath = options.path + "\\"+ file;
      console.log((info).data);

      // Read file content
      fs.readFile(filePath,(err, html) => {

        if(err) throw err;

        var tables = '',
        tableIds = [];

        var $ = cheerio.load(html);

        //Check if we should filter down based on ID.
        var filter = (typeof options.tableId !== 'undefined') ? "#" + options.tableId : 'table';

        // Try to grab each table using cheerio to get an ID for the filename. Filter HTML down to wanted tables.
        $(filter).each(function(i, element){
          tableIds[i] = $(this).attr('id');
          tables += $(this).parent().html();
        });

        var tablesAsJson = tabletojson.convert(tables);
        var status = "Found "+ tablesAsJson.length +" tables";
        console.log((status).data);

        //File to write
        tablesAsJson.forEach((table, index) => {
          var filePath = options.dest +"/" // Reset

          if(options.format == 'csv'){
            json2csv({ data: table}, function(err, csv) {
              if(err) throw err;

              filePath += tableIds[index]+".csv";

              fs.writeFile(filePath, csv, (err) => {
                if(err) throw err;

                var status = "Successfully saved " + filePath;
                console.log((status).info);
              });
            });
          }
          else {
            filePath += tableIds[index]+".json";

            fs.writeFile(filePath, JSON.stringify(table), (err) => {
              if (err) throw err;

              var status = "Successfully saved " + filePath;
              console.log((status).info);
            });
          }
        });

      });
    });
  });
}
