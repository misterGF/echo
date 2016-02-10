// Site was saved locally in process folder. The follow code will read it and generate the json.
var echo = require('./echo');
echo.convert('process', 'dest', 'json');

/*
// Same as above but filtered down to just the months table
var echo = require('./echo');
echo.convert('process', 'dest', 'json', 'month');

// Here we grab the tables from the site and save the data to a csv (default type).
var echo = require('./echo');
echo.convertUrl('https://www.coolgithubprojects.com', 'dest');

// Lastly, we filter the tables to only include the month table (based on table ID).
var echo = require('./echo');
echo.convertUrl('https://www.coolgithubprojects.com', 'dest', 'month');
*/
