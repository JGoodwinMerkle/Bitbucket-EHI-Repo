//enables access to action store on page load
window.emitMvtEvents = true; 
(function(){
	var isoRes = {
		generateMbox: function(page){
			_satellite.notify('------- ' + page + ' -------');

			adobe.target.getOffer({  
	        	"mbox": isoRes[page].mboxName,
            	"params" : isoRes[page].params(),
	          	"success": function(offers) {          
	        		adobe.target.applyOffer( { "offer": offers } );
					isoRes[page].generated = true;
	        		_satellite.notify('@@ ' + isoRes[page].mboxName + ' mbox generated');
	        	},  
	        	"error": function(status, error) {          
	         	}
	        });
		},
		start: {
			mboxName: 'ResFunnelStart',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic
						}
				}
				return false;
			}
		},
		map_pickup: {
			mboxName: 'ResFunnelPickup',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic
						}
				}
				return false;
			}
		},
		map_return: {
			mboxName: 'ResFunnelDropoff',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic
						}
				}
				return false;
			}
		},
		car_select: {
			mboxName: 'ResFunnelCars',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type &&
					_analytics.gbo &&
					_analytics.gbo.reservation &&
					_analytics.gbo.reservation.pickup_location){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic,
							'pickupId': _analytics.gbo.reservation.pickup_location.id
						}
				}
				return false;
			}
		},
		extras: {
			mboxName: 'ResFunnelExtras',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type &&
					_analytics.gbo &&
					_analytics.gbo.reservation &&
					_analytics.gbo.reservation.pickup_location){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic,
							'pickupId': _analytics.gbo.reservation.pickup_location.id
						}
				}
				return false;
			}
		},
		review: {
			mboxName: 'ResFunnelCommit',
			generated: false,
			params: function(){
				if(_analytics.gma &&
					_analytics.gma.logged_in &&
					_analytics.customer_type &&
					_analytics.gbo &&
					_analytics.gbo.reservation &&
					_analytics.gbo.reservation.pickup_location){
						var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
						return {
							'authTraffic': _analytics.gma.logged_in,
							'corpTraffic': corpTraffic,
							'pickupId': _analytics.gbo.reservation.pickup_location.id
						}
				}
				return false;
			}
		},
		init: function(){
			// Gets all recorded actions
			actionStore.subscribe('mvt', action => {
				_satellite.notify('@@ actionStore SUBSCRIBE');
				// Only generate mboxes once page is ready after session success
				if(action == 'RESERVATION_ACTIVE_SCREEN'){
					var page = location.hash.split('/')[1];
					//Checks the code for the reservation step exists and that the mbox has yet to be created
					if(isoRes[page] !== 'undefined' && !isoRes[page].generated){
						var paramInt = setInterval(function(){
							// Make sure all the data required in _analytics exists
							if(isoRes[page].params() !== false){
								clearInterval(paramInt);
								isoRes.generateMbox(page);
							}
						},100);
					} else {
						_satellite.notify('@@ isoRes[page] not found or mbox already generated');
					}
				}
			});
		},
		dependenciesLoaded: function(){
			// Clear interval check after 10 seconds in case any dependency fails
			var actTimer = setTimeout(function(){
				clearInterval(actInt);
				_satellite.notify('@@ actionStore FAILED');
				console.log('@@ actionStore FAILED');
			}, 10000);

			// Check for all mbox dependencies: Adobe Target library, Analytics object, and actionStore object
			var actInt = setInterval(function(){
				_satellite.notify('@@ CHECKING actionStore');
				if(window._analytics && 
					window.adobe &&
					window.adobe.target &&
					window.actionStore && 
					typeof actionStore  == 'object' 
					&& typeof actionStore.subscribe  == 'function'){
						clearInterval(actInt);
						clearTimeout(actTimer);
						isoRes.init();
				}
			}, 100);
		}
	}
	isoRes.dependenciesLoaded();
}());