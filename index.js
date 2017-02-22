var path = require('path');
var fs = require('fs');
var unirest = require('unirest');
var jsonfile = require('jsonfile');

var API_KEY = 'eyJpdiI6InNrRlFhR1V1TE1OYjhYSlwvc24xWXNnPT0iLCJ2YWx1ZSI6IkxjcGaGgwcWgzWDRjQm5SMVZ1aHRzR0N3Vm5hYytlWExORXJNenFLNHNsaTA2OW80XC83ek5HS1dOZU5JaFpxZWxUNW5Jb1JXY1ZSS21pcXRPUnlXQT09IiwibWFjIjoiMmFiZjliYmU3MDE3MDI5YmE1ZWU2Nzc5Yzc0ZmQ1YjQzNmZjNTZkZDcxYmU0NGM2OTI3M2Q1M2IwYjZmMjU4ZSJ9';

function createData() {
	var domains = require(path.join(__dirname, 'tmp/domains.js'));
	var companies = require(path.join(__dirname, 'tmp/companies.js'));
	var data = [];

	domains.map(function (domain) {
		var selectedCompany = companies.filter(function (company) {
			return company.name == domain.name;
		})[0];

		data.push({
			company_hid: selectedCompany.hid,
			domain: domain.domain,
		});
	});

	jsonfile.writeFileSync('tmp/data.json', data);
}
// createData();

var domains = jsonfile.readFileSync(path.join(__dirname, 'tmp/data.json'));
function writeDomains(index) {
	console.log('log', index);
	unirest.post('**/api/v1/vip/domain')
		.headers({ 'Cookie': 'gsess=' + API_KEY })
		.send(domains[index])
		.end(function (response) {
			if (response.body && response.body.message) console.log('MESSAGE: ', response.body.message + '\n');
			setTimeout(function () { writeDomains(index + 1); }, 500);
		});
}

 // writeDomains(0);

