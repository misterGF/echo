// Load our modules
var fs = require('fs'),
  tabletojson = require('tabletojson'),
  json2csv = require('json2csv'),
  cheerio = require('cheerio'),
  colors = require('colors');

// Set defaults
var defaults = {
  "path" : "process",
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

  //If path is not given kick in defaults
  if(!path){
    path = __dirname+"\\"+defaults.path;
    console.log(("Warning: No path specified. Setting it to " + path).warn);
  }

  // Do the same for dest
  if(!dest){
    dest = __dirname+"\\"+defaults.dest;
    console.log(("Warning: No destination specified. Setting it to " + dest).warn);
  }

  // Set format type
  format = (!format) ? defaults.format : format;

  //Find or create path
  try {
    // Find
    fs.readdir(__dirname, function(err, files){
      if(err) { throw err };

      // Verify path
      var pathIsThere = files.filter(function(obj){
        return obj === path;
      });

      if(pathIsThere.length === 0){
        var err = "Path to process HTML files not there. Path is set to " + path;
        console.log((err).error);
        return;
      }

      // Verify dest
      var destIsThere = files.filter(function(obj){
        return obj === dest;
      });

      // If not found let us create
      if(destIsThere.length === 0){
        console.log("Creating destination folder".warn);

        try {
          fs.mkdirSync(dest);
        } catch(e) {
          var err = "Filesystem error: " + e;
          console.log((err).error);
        }
      }

      // Parse through each and find html file
      fs.readdir(path, function(err, files){

        var htmlfiles = files.filter(function(obj){
          return (obj.match(".html")  !== null);
        });

        // Process each HTML
        htmlfiles.forEach(function(file){

          var info = "Working on " + file;
          console.log((info).data);

          // Read file content
          try {
            var filePath = path + "\\"+ file;

            var p = new Promise((resolve, reject) => {
              fs.readFile(filePath,(err, html) => {

                if(err) { reject(err); }

                var tables = '',
                  tableIds = [];

                $ = cheerio.load(html);

                //Check if we should filter down based on ID.
                var filter = (typeof tableId !== 'undefined') ? "#" + tableId : 'table';

                // Try to grab each table using cheerio to get an ID for the filename. Filter HTML down to wanted tables.
                $(filter).each(function(i, element){
                  tableIds[i] = $(this).attr('id');
                  tables += $(this).parent().html();
                });

                var info = {
                  "tableIds" : tableIds,
                  "tables" : tables
                };

                resolve(info);
              });
            });

            //Convert and file to file
            p.then(function(info){

              var tablesAsJson = tabletojson.convert(info.tables);
              var status = "Found "+ tablesAsJson.length +" tables";
              console.log((status).data);

              //File to write
              tablesAsJson.forEach((table, index) => {

                if(format == 'csv'){
                  json2csv({ data: table}, function(err, csv) {
                      if(err) throw err;

                      var filePath = dest +"/"+info.tableIds[index]+".csv";

                      fs.writeFile(filePath, csv, (err) => {
                        if(err) throw err;

                        var status = "Successfully saved " + filePath;
                        console.log((status).info);
                      });
                  });
                } else {
                  filePath = dest +"/"+info.tableIds[index]+".json";

                  fs.writeFile(filePath, JSON.stringify(table), (err) => {
                    if (err) throw err;

                    var status = "Successfully saved " + filePath;
                    console.log((status).info);
                  });
                }
              });
            })
            .catch(function(e){
              //Catch for promise
              var err = "Error during converting : " + e;
              console.log((err).error);
            });

          } catch(e) {
            var err = "Error processing html file : " + e;
            console.log((err).error);
          }
        });
      });

    });
  } catch (e) {
    var err = "Error in convert: " + e;
    console.log((err).error);
  }
}

exports.convert = convert;

// MARK : Supportive functions

// MARK : Handle errors functions
function _userException(message){
  this.message = "User input error: " + message;
};

function _fsException(message){
  this.message = message;
  this.name = "Filesystem error: ";
};

function _webException(message){
  this.message = message;
  this.name = "Web connection error: ";
};
