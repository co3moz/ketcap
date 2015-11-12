var request = require("request");
var atob = require("atob");
var readlineSync = require('readline-sync');

function Mayonez () {
}

Mayonez.attribute = ".mayonez";


Mayonez.list = function (callback) {
  request({
    url: "https://api.github.com/repos/co3moz/ketcap-mayonez/contents",
    headers: {
      'User-Agent': 'Ketcap-Mayonez getList'
    }
  }, function (err, response, body) {
    if (err) {
      return;
    }
    var list = JSON.parse(body);

    list.forEach(function (item) {
      if (item.name.lastIndexOf(Mayonez.attribute) != (item.name.length - Mayonez.attribute.length)) {
        list.remove(item);
      }
    });

    callback(list);
  });
};

Mayonez.content = function (url, callback) {//https://api.github.com/repos/co3moz/ketcap-mayonez/contents/web-basic.mayonez?ref=master
  request({
    url: url,
    headers: {
      'User-Agent': 'Ketcap-Mayonez getList'
    }
  }, function (err, response, body) {
    if (err) {
      return;
    }
    var data = JSON.parse(body);

    callback(atob(data.content));
  });
};

Mayonez.fetch = function (packageName, callback) {
  var pack = packageName + Mayonez.attribute;
  Mayonez.list(function (list) {
    var ok = list.some(function (item) {
      if (item.name == pack) {
        console.log("package founded! content downloading..");
        Mayonez.content(item.url, function (content) {
          callback(null, content);
        });
        return true;
      }
    });

    if (!ok) {
      callback("unknown package!");
    }
  });
};

Mayonez.parse = function (kObj, data) {
  var dialogBlockReg = /dialog\s*<\|\|\|([\s\S]*?)\|\|\|>/g;
  var dialogLineReg = /^\s*([\w-]+)\s*([\s\S]+?)$/gm;

  var mirror = {};
  var mixedData = data.replace(dialogBlockReg, function (all, content) {
    var ask = dialogLineReg.execAll(content);
    ask.forEach(function (item) {
      if (item[2].length > 0) {
        mirror[item[1]] = readlineSync.question(item[2] + ": ")
      }
    });

    return "";
  });

  mixedData = mixedData.replace(/<\|\|\{([\s\S]+?)}\|\|>/g, function (all, mix) {
    return mirror[mix];
  });

  var codeBlockReg = /\s*([\s\S]+?)\s*<\|\|\|([\s\S]*?)\|\|\|>/g;
  var blocks = codeBlockReg.execAll(mixedData);
  blocks.forEach(function (block) {
    var blockName = block[1];
    var blockData = block[2];
    if (blockName == "folders") {
      var folderReg = /^\s*([\s\S]+?)\s*$/gm;
      var folders = folderReg.execAll(blockData);
      folders.forEach(function(folder) {
        kObj.createFolder(folder[1]);
      });
    } else {
      kObj.createFile(blockName, blockData);
    }

  });
};


module.exports = Mayonez;