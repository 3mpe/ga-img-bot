var unirest = require('unirest');
var config = require('../lib/config');
var utils = require('./xlsxUtils');

var imageListRegexp = '<div class=\\"sirketlerLogo\\"> <img width=\\"75\\" height=\\"75\\" src=\\"(.*?)" + (.*?)';


module.exports.index = function (city) {
  var url = config.url;

  unirest.get(url)
    .end(function (response) {
      console.log('DATA FETCHED: ', url);

      if (response.body) {
        var body = response.body.replace(/\t|\n|\r/g, '');
        utils.saveHtml(body);
        var rentalList = body.match(new RegExp(imageListRegexp, 'g'));
        if (rentalList) {
          rentalList.map(function (item) {
            var detail = item.match(new RegExp(imageListRegexp));
            var imgUrl = utils.schemify(detail, ['SirketAdi', 'pass']);
            console.log('log',imgUrl);
            //utils.imgDownlaod(imgUrl);
          });
        }
      }
    });
}

