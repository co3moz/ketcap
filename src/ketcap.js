var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

/**
 * Ketcap's constructor function
 * @constructor
 */
function Ketcap (activeDirectory) {
  this.activeDirectory = activeDirectory;
}

/**
 * Creates Folder to active location
 * @param location Active Location
 */
Ketcap.prototype.createFolder = function (location) {
  var newLocation = path.resolve(this.activeDirectory, location);
  console.log(newLocation);

  try {
    mkdirp.sync(newLocation);
  } catch (e) {
    console.log("folder can't created! " + newLocation)
  }

  return this;
};


/**
 * Creates File to active location
 * @param location Active Location
 * @param data Which data will be put to file
 */
Ketcap.prototype.createFile = function (location, data) {
  var newLocation = path.resolve(this.activeDirectory, location);
  console.log(newLocation);

  try {
    fs.writeFileSync(newLocation, data);
  } catch (e) {
    console.log("file can't created! " + newLocation);
  }
  return this;
};

module.exports = Ketcap;