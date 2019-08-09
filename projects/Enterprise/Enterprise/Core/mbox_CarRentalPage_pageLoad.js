(function() {
  var isoCarRental = {
    mboxName : 'CarRentalPage',
    depends : function() {
      if (typeof window.ReservationStateTree !== 'undefined' && 
        typeof window.ReservationStateTree.data !== 'undefined' && 
        typeof window.ReservationStateTree.data.session !== 'undefined' && 
        typeof window.ReservationStateTree.data.session.reservationSession !== undefined && 
        typeof window.ReservationStateTree !== 'null') {
          var authTraffic = false;
          var profile = ReservationStateTree.get(['session','reservationSession','profile']);
          var loyaltyTier = _satellite.readCookie('renterTier');
        	var pypAuth = _satellite.readCookie('tt_sawPyp');
        	if (profile !== null && profile !== undefined) {
            authTraffic = true;
          }
          return {
            'authTraffic' : authTraffic,
            'loyaltyTier' : loyaltyTier,
            'pypAuth' : pypAuth
          };
      } else {
        return false;
      }
    },
    init : function() {
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
            } );
          },  
          "error": function(status, error) {          
            
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