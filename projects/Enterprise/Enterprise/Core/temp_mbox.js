(function(){
	var isoRes = {
		generateMbox: function(page){
			adobe.target.getOffer({
	        "mbox": isoRes[page].mboxName,
          	"params" : isoRes[page].params(),
          	"success": function(offers) {
	        		adobe.target.applyOffer( {
								"offer": offers ,
								"mbox": isoRes[page].mboxName
							} );
							isoRes[page].generated = true;
	        		_satellite.logger.log('@@ ' + isoRes[page].mboxName + ' mbox generated');
	        	},
	        	"error": function(status, error) {
							_satellite.logger.error(error);
	         	}
	     });
		},
		cars: {
			mboxName: 'ResFunnelCarsTmp',
			generated: false,
			path: '/enterprise/reservations/vehicles/availability',
			params: function(){
				if(isoRes.cars.data.availablecars){
					var noCars = 0;
					isoRes.cars.data.availablecars.forEach(function(car){
						if(car.status !== 'SOLD_OUT'){
							noCars++;
						}
					});
					return {
						'carsLength': noCars
					}
				}
				return false;
			}
		},
		init: function(){
			isoRes.checkParams();
			window.addEventListener('hashchange', isoRes.checkParams, false);
		},
		checkParams: function(){
			var page = location.hash.split('#')[1];
			if(isoRes[page] !== 'undefined' && !isoRes[page].generated){
				//APIs
				var url = enterprise.services.path + isoRes[page].path;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				        isoRes[page].data = JSON.parse(xhttp.responseText);
								console.log(isoRes[page].data);
								if(!isoRes[page].data['code']){
									isoRes.generateMbox(page);
								} else {
									isoRes.checkParams();
								}
				    }
				};
				xhttp.open('GET', url, true);
				xhttp.withCredentials = true;
				xhttp.send();

			} else {
				_satellite.logger.warn('@@ '+ page +' not found or mbox already generated');
			}
		},
		dependenciesLoaded: function(){
			// Clear interval check after 10 seconds in case any dependency fails
			var actTimer = setTimeout(function(){
				clearInterval(actInt);
				_satellite.logger.error('@@ Dependencies FAILED');
				window.adobe ? _satellite.logger.debug('@@ adobe :: OK') : _satellite.logger.error('@@ adobe :: Missing');
			}, 25000);

			var actInt = setInterval(function(){
				if(window.adobe &&
					window.adobe.target){
						clearInterval(actInt);
						clearTimeout(actTimer);
						isoRes.init();
				}
			}, 100);
		}
	}
	isoRes.dependenciesLoaded();
}());