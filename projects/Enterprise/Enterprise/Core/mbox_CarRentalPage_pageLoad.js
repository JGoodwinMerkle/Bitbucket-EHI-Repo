(function() {
  var isoCarRental = {
    mboxName : 'CarRentalPage',
    depends : function() {
      if (typeof window.ReservationStateTree !== 'undefined' &&
        typeof window.ReservationStateTree.data !== 'undefined' &&
        typeof window.ReservationStateTree.data.session !== 'undefined' &&
        typeof window.ReservationStateTree.data.session.reservationSession !== 'undefined') {
          var authTraffic = false;
          var profile = ReservationStateTree.get(['session','reservationSession','profileResponse']);
          var lioSegments = _satellite.getVar('en_lytics_segments');
          var loyaltyTier = _satellite.cookie.get('renterTier');
          var cid = ReservationStateTree.get(['model','coupon']);
          //String - Gets contract type, returns empty value if no contract exists. This is not checked in the if statement because the contract object does not exist if the cid value is empty
          var cidType = ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) ? ReservationStateTree.get(['session', 'reservationSession','contract_details','contract_type']) : '';

        	if (profile) {
            authTraffic = true;
          }
          return {
            'authTraffic' : authTraffic,
            'loyaltyTier' : loyaltyTier,
            'cdp' : lioSegments,
            'cid' : cid,
            'cidType' : cidType
          };
      } else {
        return false;
      }
    },
    init : function() {
      isoCarRental.dependsLoaded(function() {
        var params = isoCarRental.depends();
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
        adobe.target.getOffer({
          "mbox": isoCarRental.mboxName,
          "params" : params,
          "success": function(offers) {
            adobe.target.applyOffer( {
              "mbox": isoCarRental.mboxName,
              "offer": offers
            });
          },
					"error" : function(){

					}
        });
      });
    },
    dependsLoaded : function(callback) {
      var mInt = setInterval(function() {
        if (typeof window.adobe !== 'undefined' &&
          typeof window.adobe.target !== 'undefined' &&
          typeof window._satellite !== 'undefined' &&
  				isoCarRental.depends() !== false) {
            clearInterval(mInt);
            _satellite.logger.debug('adobe + target + depends met');
            if (typeof callback === 'function') {
              callback();
            }
        }
      },100);
      setTimeout(function(){
        clearInterval(mInt);
      },10000);
    }
  };
  isoCarRental.init();
})();
