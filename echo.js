// Load our modules
var fs = require('fs'),
tabletojson = require('tabletojson'),
json2csv = require('json2csv'),
cheerio = require('cheerio');

var defaults = {
  "path" : "process",
  "dest" : "dest",
  "format" : "csv"
};

var convert = (path, dest, format) => {

  //If path is not given kick in defaults
  if(typeof path === 'undefined'){
    path = __dirname+"\\"+defaults.path;
    console.log("Warning: No path specified. Setting it to ", path);
  }

  // Do the same for dest
  if(typeof dest === 'undefined'){
    dest = __dirname+"\\"+defaults.dest;
    console.log("Warning: No destination specified. Setting it to ", dest);
  }

  // Set format type
  format = (typeof format === 'undefined') ? defaults.format : format;

  //Find or create path
  try {
    // Find
    fs.readdir(__dirname, function(err, files){
      if(err) { throw new Error(err) };

      // Verify path
      var pathIsThere = files.filter(function(obj){
        return obj === path;
      });

      if(pathIsThere.length === 0){
        throw new Error ("Path to process HTML files no there. Path is set to " + path);
      }

      // Verify dest
      var destIsThere = files.filter(function(obj){
        return obj === dest;
      });

      // If not found let us create
      if(destIsThere.length === 0){
        console.log("Creating destination folder");

        try {
          fs.mkdirSync(dest);
        } catch(e) {
          console.error("Error creating path: ", e.message);
        }
      }

      // Parse through each and find html file
      fs.readdir(path, function(err, files){

        var htmlfiles = files.filter(function(obj){
          return (obj.match(".html")  !== null);
        });

        // Process each HTML
        htmlfiles.forEach(function(file){

          console.log("Working on ", file);

          // Read file content
          try {
            var filePath = path + "\\"+ file;

            var p = new Promise((resolve, reject) => {
              fs.readFile(filePath,(err, html) => {

                if(err) { reject(err); }

                var tablesAsJson = tabletojson.convert(html);
                var info = {
                  "table" : tablesAsJson,
                  "html" : html
                };

                resolve(info);
              });
            });

            //Convert and file to file
            p.then(function(info){

              // Try to grab each table using cheerio to get an ID for the filename
              var tables = [];
              $ = cheerio.load(info.html);

              $('table').each(function(i, element){
                tables[i] = $(this).attr('id');
              });

              console.log("Found "+ tables.length +" tables");

              info.table.forEach((table, index) => {

                if(format == 'csv'){
                  json2csv({ data: table}, function(err, csv) {

                      if(err) { throw new Error(err); }

                      // Write file
                      var filePath = dest +"/"+tables[index]+".csv";

                      fs.writeFile(filePath, csv, (err) => {
                        if (err) throw err;
                        console.log(filePath + ' saved!');
                      });
                  });
                }
              });
            })
            .catch(function(e){
              console.log("Error: ", e);
            });

          } catch(e) {
            console.log("Error processing html file : ", e);
          }

        });
      });

    });
  } catch (e) {
    console.log("Error getting files: ", e);
  }
}

exports.convert = convert;
