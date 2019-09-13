(function() {
	var isoHash = {
		lioDomains : ['com','uk'],
		isLioLoaded : function(){
			// when lytics is enabled for the listed domains check lio object, otherwise set to true
			return isoHash.isLioEnabled ? typeof window.lio !== 'undefined' && typeof window.lio.segmentsArray !== 'undefined' && window.lio.segmentsArray.length > 0 : true;
		},
		checkLio : function(){
			var domain = location.hostname.split('.').reverse()[0];
			isoHash.isLioEnabled = isoHash.lioDomains.indexOf(domain) > -1;
			if(localStorage.getItem('sdsat_stagingLibrary')=='true' && /xqa|int/.test(location.hostname)) { //temp workaround staging
				isoHash.isLioEnabled = false;
			}
		},
		steps: {
			"#location": {
				"mboxName": "ResFunnelLocation",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {
						//Boolean - corporate traffic;
						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						//Boolean - Authenticated traffic checks if profile is present
						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						//String - Gets any coupon or other CID, returns null if none is added;
						var cid = ReservationStateTree.get(['model','coupon']);
						//String - Gets contract type, returns empty value if no contract exists. This is not checked in the if statement because the contract object does not exist if the cid value is empty
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						//String - Gets 3-letter currency code selected by the user
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						//String - Gets lytics audiences and creates a comma delimited string
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';

						return {
							'step': 'location',
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'cid': cid,
							'cdp' : lioSegments,
							'currency' : currency
						};
					} else {
						return false;
					}
				}
			},
			"#cars": {
				"mboxName": "ResFunnelCars",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickup_location !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickupLocationWithDetail !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {

						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						// String - Pickup location type (e.g. airport, city, etc.)
						var branchType = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','location_type']);
						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						//String - Selected pickup location's four letter/integer group number
						var groupNumber = ReservationStateTree.get(['session','reservationSession','pickupLocationWithDetail','location_id']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';
						//Integer - Selected pick up location's peopleSoft ID
						var peopleSoftId = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','id']);
						//String - Selected pickup location's two letter country code
						var pickupCountryCode = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','address','country_code']);

						return {
							'step': 'cars',
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'pickupId': peopleSoftId,
							'countryCode': pickupCountryCode,
							'cid': cid,
							'groupNumber' : groupNumber,
							'branchType': branchType,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency
						};
					} else {
						return false;
					}
				}
			},
			"#extras": {
				"mboxName": "ResFunnelExtras",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.model.carSelect !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickup_location !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickupLocationWithDetail !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {

						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						var branchType = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','location_type']);
						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						var groupNumber = ReservationStateTree.get(['session','reservationSession','pickupLocationWithDetail','location_id']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';
						//String - Method of payment selected [PAYLATER,REDEMPTION,PREPAY,CURRENCY]
						var payType = ReservationStateTree.get(['session', 'reservationSession','chargeType']);
						var peopleSoftId = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','id']);
						var pickupCountryCode = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','address','country_code']);

						return {
							'step': 'extras',
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'pickupId': peopleSoftId,
							'cid': cid,
							'payType': payType,
							'countryCode': pickupCountryCode,
							'groupNumber' : groupNumber,
							'branchType': branchType,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency
						};
					} else {
						return false;
					}
				}
			},
			"#commit": {
				"mboxName": "ResFunnelCommit",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.model.carSelect !== 'undefined' &&
						typeof window.ReservationStateTree.data.model.sameLocation !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.creationTime !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickup_location !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickup_time !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickupLocationWithDetail !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {

						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						// String - Pickup location type (e.g. airport, city, etc.)
						var branchType = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','location_type']);
						var groupNumber = ReservationStateTree.get(['session','reservationSession','pickupLocationWithDetail','location_id']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';
						// String - User loyalty type and level (e.g. Plus, Emerald Club, etc.)
						var loyaltyTier = authTraffic ? ReservationStateTree.get(['session', 'reservationSession','profileResponse','profile','basic_profile','loyalty_data','loyalty_tier']) : '';
						// Boolean - Oneway or roundtrip reservation
						var oneway = !ReservationStateTree.get(['model','sameLocation']);
						var payType = ReservationStateTree.get(['session', 'reservationSession','chargeType']);
						var peopleSoftId = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','id']);
						var pickupCountryCode = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','address','country_code']);

						var searchTime = new Date(ReservationStateTree.get(['session', 'reservationSession','creationTime']));
						var pickupTime = new Date(ReservationStateTree.get(['session', 'reservationSession','pickup_time']));
						var leadtime = parseInt((pickupTime - searchTime)/86400000);

						return {
							'step': 'commit',
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'loyaltyTier' : loyaltyTier,
							'pickupId': peopleSoftId,
							'cid': cid,
							'payType': payType,
							'leadtime': leadtime,
							'oneway': oneway,
							'countryCode': pickupCountryCode,
							'branchType': branchType,
							'groupNumber' : groupNumber,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency
						};
					} else {
						return false;
					}
				}
			},
			"#confirmed": {
				"mboxName": "ResFunnelConfirm",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.model.carSelect !== 'undefined' &&
						typeof window.ReservationStateTree.data.session !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.confirmationNumber !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.pickupLocationWithDetail !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.selectedCarClassDetails !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {

						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						// String - Reserved car class code
						var carCode = ReservationStateTree.get(['session', 'reservationSession', 'selectedCarClassDetails','code']);
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						// String - Reservation confirmation number
						var confirmationNumber = ReservationStateTree.get(['session', 'reservationSession', 'confirmationNumber']);
						var groupNumber = ReservationStateTree.get(['session','reservationSession','pickupLocationWithDetail','location_id']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';
						var payType = ReservationStateTree.get(['session', 'reservationSession','chargeType']);
						var peopleSoftId = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','id']);

						// String - Reservation's estimated total payment
						var orderTotal = payType !== "REDEMPTION" ? ReservationStateTree.get(['session', 'reservationSession', 'selectedCarClassDetails','vehicle_rates',payType,'price_summary','estimated_total_payment','amount']) : 0;

						return {
							'step': 'confirmed',
							'orderId': confirmationNumber,
							'orderTotal': orderTotal,
							'productPurchasedId': carCode,
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'pickupId': peopleSoftId,
							'cid': cid,
							'payType': payType,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency,
							'groupNumber' : groupNumber
						};
					} else {
						return false;
					}
				}
			},
			"#details" : {
				"mboxName" : "ResFunnelDetails",
				"depends" : function(){
					if(typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.session !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.selectedCarClassDetails !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()){

						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						var carCode = ReservationStateTree.get(['session', 'reservationSession', 'selectedCarClassDetails','code']);
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';
						var payType = ReservationStateTree.get(['session', 'reservationSession','chargeType']);
						var peopleSoftId = ReservationStateTree.get(['session', 'reservationSession', 'pickup_location','id']);

						return {
							'step': 'details',
							'productPurchasedId': carCode,
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'pickupId': peopleSoftId,
							'cid': cid,
							'payType': payType,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency
						}
					} else {
						return false;
					}
				}
			},
			"#book": {
				"mboxName": "ResFunnelBook",
				"depends": function() {
					if (typeof window.ReservationStateTree !== 'undefined' &&
						typeof window.ReservationStateTree.data !== 'undefined' &&
						typeof window.ReservationStateTree.data.model !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.corporate !== 'undefined' &&
						typeof window.ReservationStateTree.data.session.reservationSession.view_currency_code !== 'undefined' &&
						isoHash.isLioLoaded()) {

						var corpTraffic = ReservationStateTree.get(['session', 'reservationSession', 'corporate']);
						var authTraffic = ReservationStateTree.get(['session', 'reservationSession', 'profileResponse']) ? true : false;
						var cid = ReservationStateTree.get(['model','coupon']);
						var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';
						var currency = ReservationStateTree.get(['session','reservationSession','view_currency_code']);
						var lioSegments = isoHash.isLioEnabled ? window.lio.segmentsArray.toString() : '';

						return {
							'step': 'book',
							'corpTraffic': corpTraffic,
							'authTraffic': authTraffic,
							'cid': cid,
							'cdp' : lioSegments,
							'cidType' : cidType,
							'currency' : currency
						};
					} else {
						return false;
					}
				}
			}
		},
		init: function() {
			isoHash.checkLio(); // sets up checks for domains with lytics
			isoHash.dependsLoaded(function() {
				var hash = window.location.hash;
				if (hash in isoHash.steps) {
					var params = isoHash.steps[hash]["depends"]();
					adobe.target.getOffer({
						"mbox": isoHash.steps[hash].mboxName,
						"params": params,
						"success": function(offers) {
							adobe.target.applyOffer({
								"mbox": isoHash.steps[hash].mboxName,
								"offer": offers
							});
							adobe.target.getOffer({
								"mbox": isoHash.steps[hash].mboxName+"FS",
								"params": params,
								"success": function(offers) {
									adobe.target.applyOffer({
										"mbox": isoHash.steps[hash].mboxName+"FS",
										"offer": offers
									});
								},
								"error" : function(){

								}
							});
						},
						"error" : function(){

						}
					});
				}
			});
		},
		dependsLoaded: function(callback) {
			var hash = window.location.hash;
			if (hash in isoHash.steps) {
				window.clearTimeout(isoHash.timer);
				if (typeof window.adobe !== 'undefined' &&
					typeof window.adobe.target !== 'undefined' &&
					isoHash.steps[hash]["depends"]() !== false) {
					_satellite.notify('adobe + target + depends met');
					if (typeof callback === 'function') {
						callback();
					}
				} else {
					isoHash.timer = window.setTimeout(function() {
						isoHash.dependsLoaded(callback);
					}, 100);
				}
			}
		}
	};
	isoHash.init();
})();
