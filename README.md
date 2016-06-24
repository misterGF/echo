# Echo - Convert HTML tables to JSON/CSVs
Nix Build: TravisCI: ![Travis CI Status](https://travis-ci.org/misterGF/echo.svg?branch=master)

Windows Build: AppVeoyr: ![AppVeyour](https://ci.appveyor.com/api/projects/status/ggni7vsm023ux3am?svg=true)

NPM: ![NPM Version](https://img.shields.io/npm/v/echo-table-2-file.svg)

Echo is able to read tables from a website or a html file and convert it to JSON or CSV.
Perfect for saving data from a website and loading it into excel, database, etc.

![Echo Icon](http://res.cloudinary.com/gatec21/image/upload/c_scale,w_600/v1455140518/TABLE_ujdxuv.jpg)
---

## Install
```javascript
npm i "echo-table-2-file"
```
---

## Example usage
For our examples we will be using the tables from www.coolgithubprojects.com.
We use **.convert** for local HTML files and **.convertUrl** for online retrieval.

``` javascript
// Site was saved locally in process folder. The follow code will read it and generate the json.
var echo = require('echo-table-2-file');
echo.convert('process', 'output', 'json');

```

``` javascript
// Here we grab the tables from the site and save the data to a csv (default type).
var echo = require('echo-table-2-file');
echo.convertUrl('https://www.coolgithubprojects.com', 'output');

```

``` javascript
// Lastly, we filter the tables to only include the month table (based on table ID).
var echo = require('echo-table-2-file');
echo.convertUrl('https://www.coolgithubprojects.com', 'output', 'months');

/* OUTPUT EXAMPLE : ./output/month.csv

  "0","Language","Change","Name"
  "","JavaScript","+5607","iojs/io.js"
  "","Go","+5439","golang/go"
  "","Other","+4581","prakhar1989/awesome-courses"
  "","JavaScript","+4045","dimsemenov/PhotoSwipe"
  "","PHP","+3284","isohuntto/openbay"
  ...

*/
```

---

## Contributing
Pull requests welcome!
