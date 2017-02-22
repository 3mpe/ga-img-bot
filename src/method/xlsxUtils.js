var xlsx = require('node-xlsx').default;
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const image_downloader = require('image-downloader');

var bw = require("buffered-writer");
var utils = {};

//utils.schemas(params).saveExcel();
entities = new Entities();

utils.schemasList = [];
utils.schemas = function (params) {
	utils.schemasList.push(params);
	return utils;
};


utils.saveExcel = function (params) {
	var data = utils.schemasList;
	var table = [];
	data.map(function (item) {
		var row = [];
		Object.keys(item).map(function (key) { row.push([item[key]]); });
		table.push(row);
	});

	var buffer = xlsx.build([{ name: "rentaCars", data: table }]);

	var out = bw.open("saved.xlsx")
		.on("error", function (error) {
			console.log(error);
		})
		.write(buffer)
		.close();

	// var wstream = fs.createWriteStream('saved.xlsx');
	// wstream.writeln(buffer);
	// wstream.end();

};

utils.saveHtml = function (html) {
	fs.appendFile('saved_html.txt', html, function (err) {
		if (err) return console.log(err);
		console.log('Appended!');
	});

};

utils.schemify = function (data, schema) {
	var response = {};
	schema.map((key, index) => {
		if (key != 'pass' || key != undefined)
			response[key] = data[index];
	});
	return response;
}

utils.imgDownlaod = function (downloadUrl, path) {
	path = path;

	var imgOptions = {
		url: downloadUrl,
		dest: path, // Save to path 
		done: function (err, filename, image) {
			if (err) {
				throw err;
			}
			console.log('File saved to', filename);
		},
	};
	image_downloader(imgOptions);
}

utils.imgToBase64 = function (path, imgPathName) {
	var path = path + '/' + imgPathName;
	var options = { localFile: true, string: true };
	var encodeBase64 = {};
	base64.base64encoder(path, options, function (err, image) {
		if (err) { console.log(err); }
		encodeBase64.image = image;
	});
	return encodeBase64
}

module.exports = utils;

