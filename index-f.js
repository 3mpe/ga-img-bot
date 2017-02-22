var path = require('path');
var fs = require('fs');
var unirest = require('unirest');
var xlsx = require('node-xlsx').default;


var API_KEY = 'eyJpdiI6IndRZDR4VUhwdFI0TGNhSWg2TGcwSmc9PSIsInZhbHVlIjoibkJGY2FXaXF2SEhuaCszNmE2aHpXM0lwK2Fhcm4yUVVzTFlqa3g5WHpCT1VzczlpcFZRUWkyRWxtNkwrT3E0ZDI4MlY1Z0J3b1lHV0p2SkhLN3dqYXc9PSIsIm1hYyI6IjczYTIyZDU0OTI5YmI5MTkzMzI4NGU5MGViODcyMDExMmU1NjZiYWYwYWU4NDI2NzgxZGE0OTVkZmFlMWY4ODMifQ==';
var start = 1;
var stop = 10;

//company added
function getFortuneData(start, stop) {
	start = (start > 491 ? 491 : start);
	stop = (stop > 500 ? 500 : stop);

	var companyList = [];
	var alllistParams = { kisit: "Net Satış TL", page: start + '-' + stop, sene: 2016 };
	unirest.post('http://www.fortuneturkey.com/Fortune500/data/ajax/listele')
		.query(alllistParams)
		.end(function (response) {
			var excelItem;
			if (!response || (response && !response.body)) {
				return;
			}
			//console.log('log',response.request.uri);
			response.body.map(function (item) {
				var params = { SirketId: item.SirketId, selectCity: item.SehirAdi, description: item.AltSektorAdi, name: item.SirketAdi, city_id: 34, district_id: 456 };
				if (item.SirketLogo)
					params.logoName = item.SirketLogo;
				companyList.push(params);
			});

			var counter = 1;
			companyList.map(function (item) {
				var request = unirest.post('**/api/v1/vip/company')
					.headers({ 'Cookie': 'gsess=' + API_KEY })
					.field('name', item.name)
					.field('description', item.description)
					.field('city_id', item.city_id)
					.field('district_id', item.district_id);
				if ((item.logoName !== "" || item.logoName !== undefined) && fs.existsSync(path.join(__dirname, './images/' + item.logoName))) {
					request.attach('logo', path.join(__dirname, './images/' + item.logoName));
				}
				// process.abort();


				request.end(function (response) {
					console.log('item.SirketId', item.SirketId);
					console.log('response.body', response.body);
					if (response.body && response.body.message)
						console.log('MESSAGE: ', response.body.company.name + '\n');

					counter++;
					if (counter == 10) {
						start = (start + 10);
						stop = (stop + 10);

						if (start <= 491 || stop <= 500) {
							setTimeout(function () {
								getFortuneData(start, stop);
							}, 2000);
						}
					}
				});
			});
		});
}
// getFortuneData(start, stop);