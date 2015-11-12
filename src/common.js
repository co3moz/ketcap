if (!Array.prototype.remove) {
  Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };
}

if (!RegExp.prototype.execAll) {
  RegExp.prototype.execAll = function (what) {
    var data = [];
    var temp;
    while (temp = this.exec(what)) {
      data.push(temp);
    }
    return data;
  }
}