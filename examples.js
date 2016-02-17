// Site was saved locally in process folder. The follow code will read it and generate the json.
var echo = require('./src/echo-table-2-file'); // Ch

//console.log("Get all tables as json"); // Convert requires html files being put into the path
//echo.convert('process', 'dest', 'json');

// Same as above but filtered down to just the months table
//console.log("Get the months table as csv");
//echo.convert('process', 'dest', 'csv', 'months');

// Here we grab the tables from the site and save the data to a csv (default type).
console.log("Get all tables from website");
echo.convertUrl('https://www.coolgithubprojects.com', 'dest');
//echo.convertUrl('https://www.coolgithubprojects.com', 'dest', 'json');
// Lastly, we filter the tables to only include the month table (based on table ID).
//console.log("Get the months table as csv");
//echo.convertUrl('https://www.coolgithubprojects.com', 'dest', 'csv', 'months');
