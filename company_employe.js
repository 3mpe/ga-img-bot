var path = require('path');
var fs = require('fs');
var unirest = require('unirest');
var jsonfile = require('jsonfile');
var utils = require('./src/method/xlsxUtils');
var API_KEY = 'eyJpdiI6Ik16blRkRVlhZmx1VG5UM2VVQThKNlE9PSIsInZhbHVlIjoiR242ODFrMmdmNEs0NStlZ2RZdHlIYmNzU3VqMnZyV2tINE1MeHFidjlheWJCMVhxU01WYlRJTHpYUzhYeFZ6U2RzbTlVQ2ZpOVNuS2ZEc3VRNFU3c1E9PSIsIm1hYyI6ImRhNWFiMThkZmVlNGJkNjc2YzhjNjU3ZDQwZWM4MDNjMzY3NTc1YTQ0NTRhMGQ4YWI4YzNkNzIzYTMyNzQ5NTQifQ==';

//company added
function getUrlData() {
	var data = [];
	var alllistParams = { kisit: "Net Satış TL", page: 0, sene: 2016 };
	unirest.post('http://www.fortuneturkey.com/Fortune500/data/ajax/listele')
		.query(alllistParams)
		.end(function (response) {
			var excelItem;
			if (!response || (response && !response.body)) {
				return;
			}
			console.log('log', response.request.uri);
			response.body.map(function (item) {
				var params = {
					name: item.SirketAdi,
					SirketNo: item.SirketNo,
					url: 'http://www.fortuneturkey.com/Fortune500/2016/botas-boru-hatlari-ile-petrol-tasima-a-s--' + item.SirketNo
				};
				data.push(params);
			});
			jsonfile.writeFileSync('tmp2/urlData.json', data);
		});
}
// getUrlData();


function createData() {
	var domains = require(path.join(__dirname, 'tmp/domains.js'));
	var companies = require(path.join(__dirname, 'tmp/companies.js'));
	var urlData = jsonfile.readFileSync(path.join(__dirname, 'tmp2/urlData.json'));

	var data = [];

	domains.map(function (domain) {
		var selectedCompany = companies.filter(function (company) {
			return company.name == domain.name;
		})[0];

		var selectedUrl = urlData.filter(function (item) {
			return item.name == domain.name;
		})[0];

		data.push({
			company_hid: selectedCompany.hid,
			domain: domain.domain,
			url: selectedUrl.url
		});
	});

	jsonfile.writeFileSync('tmp2/data.json', data);
}
// createData();



var urlData = jsonfile.readFileSync(path.join(__dirname, 'tmp2/data.json'));
var dataRegexp = '<td class="Soltd" style="text-align: left; font-weight: bold;">  Çalışan sayısı<\/td>                        <td>(.*?)<\/td> ';

function postCompanyCountindex(index) {
	console.log('index',index);
	console.log('url',urlData[index].url);
	unirest.get(urlData[index].url)
		.end(function (response) {
			var ddata = response.body.replace(/\t|\n|\r/g, '');
			if (ddata) {
				var number_of_employee = ddata.match(new RegExp(dataRegexp))[1];
				var gaUrl = '**/api/v1/vip/company/' + urlData[index].company_hid;
				console.log('firmada ki personel sayısı : ',number_of_employee);

				unirest.post(gaUrl)
					.headers({ 'Cookie': 'gsess=' + API_KEY })
					.send({ number_of_employee: number_of_employee })
					.end(function (response) {
						if (response.body && response.body.message) console.log('MESSAGE: ', response.body.message + '\n');
						setTimeout(function () { postCompanyCountindex(index + 1); }, 500);
					});
			}
		});
}

postCompanyCountindex(1);

