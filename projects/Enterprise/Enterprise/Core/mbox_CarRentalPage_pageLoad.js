(function() {
  var isoCarRental = {
		lioDomains : ['com','uk'],
		isLioLoaded : function(){
			// when lytics is enabled for the listed domains check lio object, otherwise set to true
			return isoCarRental.isLioEnabled ? typeof window.lio !== 'undefined' && typeof window.lio.segmentsArray !== 'undefined' && window.lio.segmentsArray.length > 0 : true;
		},
		checkLio : function(){
			var domain = location.hostname.split('.').reverse()[0];
			isoCarRental.isLioEnabled = isoCarRental.lioDomains.indexOf(domain) > -1;
      if(localStorage.getItem('sdsat_stagingLibrary')=='true' && /xqa|int/.test(location.hostname)) { //temp workaround staging
				isoCarRental.isLioEnabled = false;
			}
		},
    mboxName : 'CarRentalPage',
    depends : function() {
      if (typeof window.ReservationStateTree !== 'undefined' &&
        typeof window.ReservationStateTree.data !== 'undefined' &&
        typeof window.ReservationStateTree.data.session !== 'undefined' &&
        typeof window.ReservationStateTree.data.session.reservationSession !== undefined &&
        typeof window.ReservationStateTree !== 'null' &&
        isoCarRental.isLioLoaded()) {
          var authTraffic = false;
          var profile = ReservationStateTree.get(['session','reservationSession','profileResponse']);
          var lioSegments = isoCarRental.isLioEnabled ? window.lio.segmentsArray.toString() : '';
          var loyaltyTier = _satellite.readCookie('renterTier');
        	var pypAuth = _satellite.readCookie('tt_sawPyp');
          var cid = ReservationStateTree.get(['model','coupon']);
          //String - Gets contract type, returns empty value if no contract exists. This is not checked in the if statement because the contract object does not exist if the cid value is empty
          var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';

        	if (profile) {
            authTraffic = true;
          }
          return {
            'authTraffic' : authTraffic,
            'loyaltyTier' : loyaltyTier,
            'pypAuth' : pypAuth,
            'cdp' : lioSegments,
            'cid' : cid,
            'cidType' : cidType
          };
      } else {
        return false;
      }
    },
    init : function() {
      isoCarRental.checkLio();
      isoCarRental.dependsLoaded(function() {
        var params = isoCarRental.depends();
        //console.log(params);
        adobe.target.getOffer({
          "mbox": isoCarRental.mboxName,
          "params" : params,
          "success": function(offers) {
            adobe.target.applyOffer( {
              "mbox": isoCarRental.mboxName,
              "offer": offers
            });
						adobe.target.getOffer({
		          "mbox": isoCarRental.mboxName+"FS",
		          "params" : params,
		          "success": function(offers) {
		            adobe.target.applyOffer( {
		              "mbox": isoCarRental.mboxName+"FS",
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
      });
    },
    dependsLoaded : function(callback) {
      window.clearTimeout(isoCarRental.timer);
      var profile = isoCarRental.depends();
      if (typeof window.adobe !== 'undefined' &&
        typeof window.adobe.target !== 'undefined' &&
				profile !== false) {
          if (typeof callback === 'function') {
            callback();
          }
      } else {
        isoCarRental.timer = window.setTimeout(function(){isoCarRental.dependsLoaded(callback);}, 100);
      }
    }
  };
  isoCarRental.init();
})();
