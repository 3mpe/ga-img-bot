var path = require('path');
var unirest = require('unirest');


var bins = require(path.join(__dirname, 'tmp/bins.js'));

function addBin(index) {
	var discountHid ="VDZ9beBrvk";
	var url = "https://sandbox_erp.gaaraj.com/api/v1/discount/"+ discountHid +"/bin";
	unirest.post({
		bin: bins.
	}).end(function (response) {
		
	});
}
