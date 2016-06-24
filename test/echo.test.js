/* global describe:true it:true beforeEach:true */
var fs = require('fs')
var path = require('path')
var chai = require('chai')
chai.use(require('chai-fs'))
var expect = chai.expect
var echo = require('../src/echo-table-2-file')

describe('Cleanup output file', function () {
  this.timeout(30000)
  var rmDir = function (dirPath) {
    try {
      var files = fs.readdirSync(dirPath)
    } catch (e) {
      return
    }

    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i]
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath)
        } else {
          rmDir(filePath)
        }
      }
      fs.rmdirSync(dirPath)
    }
  }

  it('Should cleanup output folder', function () {
    var outputPath = path.join(process.cwd(), 'output')
    rmDir(outputPath)
    fs.stat(outputPath, function (err, dir) {
      expect(err.code).to.equal('ENOENT')
    })
  })
})

describe('Test ConvertURL w/ Json', function () {
  this.timeout(30000)
  const TIME_TO_GENERATE_JSON = 6000

  beforeEach(function (done) {
    echo.convertUrl('https://www.coolgithubprojects.com', 'output', 'json')
    setTimeout(function () {
      done()
    }, TIME_TO_GENERATE_JSON)
  })

  it('Should generate valid json files', function () {
    expect('output/days.json').to.be.a.file('Should be a json file').with.json
    expect('output/weeks.json').to.be.a.file('Should be a json file').with.json
    expect('output/months.json').to.be.a.file('Should be a json file').with.json
  })
})

describe('Test ConvertURL w/ csv', function () {
  this.timeout(30000)
  const TIME_TO_GENERATE_JSON = 6000

  beforeEach(function (done) {
    echo.convertUrl('https://www.coolgithubprojects.com', 'output', 'csv')
    setTimeout(function () {
      done()
    }, TIME_TO_GENERATE_JSON)
  })

  it('Should generate valid csv files', function () {
    expect('output/days.csv').to.be.a.file('Should be a csv file').with.csv
    expect('output/weeks.csv').to.be.a.file('Should be a csb file').with.csv
    expect('output/months.csv').to.be.a.file('Should be a csv file').with.csv
  })
})

describe('Test ConvertURL w/ filter', function () {
  this.timeout(30000)
  const TIME_TO_GENERATE_JSON = 6000

  beforeEach(function (done) {
    echo.convertUrl('https://www.coolgithubprojects.com', 'output/monthly', 'json', 'months')
    setTimeout(function () {
      done()
    }, TIME_TO_GENERATE_JSON)
  })

  it('Should generate a valid json file', function () {
    expect('output/monthly/months.json').to.be.a.file('Should be a json file').with.json
  })
})

describe('Test Convert w/ filter', function () {
  this.timeout(30000)
  const TIME_TO_GENERATE_JSON = 6000

  beforeEach(function (done) {
    echo.convert('static', 'output/static', 'csv', 'months')
    setTimeout(function () {
      done()
    }, TIME_TO_GENERATE_JSON)
  })

  it('Should generate a valid csv file', function () {
    expect('output/static/months.csv').to.be.a.file('Should be a csv file').with.csv
  })
})
