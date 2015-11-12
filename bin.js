#!/usr/bin/env node

var currentDir = process.cwd();
var Common = require("./src/common");
var Ketcap = require("./src/ketcap");
var Mayonez = require("./src/mayonez");

var argv = require('optimist').argv;

console.log("Ketcap application container");

switch (argv._[0]) {
  case "install":
    var packageName = (argv._[1] || "").trim();
    if(packageName.length == 0) {
      return console.log("invalid package name");
    }

    console.log("gathering..");
    Mayonez.fetch(packageName, function (err, content) {
      if (err) {
        return console.log("I can't find the package");
      }

      Mayonez.parse(new Ketcap(currentDir), content);
    });
    break;

  case "list":
    console.log("fetching..");
    Mayonez.list(function (list) {
      console.log("You can install these packages: ");
      list.forEach(function (item, index) {
        console.log("  -  #" + (index + 1) + " " + item.name.substring(0, item.name.lastIndexOf(Mayonez.attribute)));
      });
      console.log("ketcap install package-name");
    });
    break;
}