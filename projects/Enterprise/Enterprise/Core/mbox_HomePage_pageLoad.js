(function() {
  var isoHomepage = {
		lioDomains : ['com','uk'],
		isLioLoaded : function(){
			// when lytics is enabled for the listed domains check lio object, otherwise set to true
			return isoHomepage.isLioEnabled ? typeof window.lio !== 'undefined' && typeof window.lio.segmentsArray !== 'undefined' && window.lio.segmentsArray.length > 0 : true;
		},
		checkLio : function(){
			var domain = location.hostname.split('.').reverse()[0];
			isoHomepage.isLioEnabled = isoHomepage.lioDomains.indexOf(domain) > -1;
      if(localStorage.getItem('sdsat_stagingLibrary')=='true' && /xqa|int/.test(location.hostname)) { //temp workaround staging
				isoHomepage.isLioEnabled = false;
			}
		},
    mboxName : 'HomePage',
    depends : function() {
      if (typeof window.ReservationStateTree !== 'undefined' &&
        typeof window.ReservationStateTree.data !== 'undefined' &&
        typeof window.ReservationStateTree.data.session !== 'undefined' &&
        typeof window.ReservationStateTree.data.session.reservationSession !== undefined &&
        typeof window.ReservationStateTree !== 'null' &&
        isoHomepage.isLioLoaded()) {
          var authTraffic = false;
          var profile = ReservationStateTree.get(['session','reservationSession','profileResponse']);
          var lioSegments = isoHomepage.isLioEnabled ? window.lio.segmentsArray.toString() : '';
          var loyaltyTier = _satellite.cookie.get('renterTier');
        	var pypAuth = _satellite.cookie.get('tt_sawPyp');
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
      isoHomepage.checkLio();
      isoHomepage.dependsLoaded(function() {
        var params = isoHomepage.depends();
        //console.log(params);
        adobe.target.getOffer({
          "mbox": isoHomepage.mboxName,
          "params" : params,
          "success": function(offers) {
            adobe.target.applyOffer( {
              "mbox": isoHomepage.mboxName,
              "offer": offers
            });
						adobe.target.getOffer({
		          "mbox": isoHomepage.mboxName+"FS",
		          "params" : params,
		          "success": function(offers) {
		            adobe.target.applyOffer( {
		              "mbox": isoHomepage.mboxName+"FS",
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
      window.clearTimeout(isoHomepage.timer);
      var profile = isoHomepage.depends();
      if (typeof window.adobe !== 'undefined' &&
        typeof window.adobe.target !== 'undefined' &&
				profile !== false) {
          if (typeof callback === 'function') {
            callback();
          }
      } else {
        isoHomepage.timer = window.setTimeout(function(){isoHomepage.dependsLoaded(callback);}, 100);
      }
    }
  };
  isoHomepage.init();
})();
