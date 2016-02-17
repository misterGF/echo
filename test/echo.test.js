var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var echo = require('../src/echo-table-2-file');

describe("ConvertURL Test", function(){
  this.timeout(20000);
  const TIME_TO_GENERATE_JSON = 3000;

  beforeEach(function(done){
    echo.convertUrl('https://www.coolgithubprojects.com', 'dest','json');
    echo.convertUrl('https://www.coolgithubprojects.com', 'dest','csv');
    setTimeout(function(){
      done();
    }, TIME_TO_GENERATE_JSON);
  });

  it("Should generate valid json files", function(){
    expect('dest/days.json').to.be.a.file('Should be a json file').with.json;
    expect('dest/weeks.json').to.be.a.file('Should be a json file').with.json;
    expect('dest/months.json').to.be.a.file('Should be a json file').with.json;
    expect('dest/days.csv').to.be.a.file('Should be a json file').with.csv;
    expect('dest/weeks.csv').to.be.a.file('Should be a json file').with.csv;
    expect('dest/months.csv').to.be.a.file('Should be a json file').with.csv;
  });
});
