(function() {
  var isoResWidget = {
    mboxName : 'ResWidget',
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
    mboxExists: function(){
        var exists = false;
        for (var i = 0; i < ttMETA.length; i++) {
            if (ttMETA[i].MboxName === isoResWidget.mboxName) {
                exists = true;
            }
        }
        return exists;
    },
    init : function() {
      isoResWidget.dependsLoaded(function() {
        if(!isoResWidget.mboxExists()){
          var params = isoResWidget.depends();
          adobe.target.getOffer({
            "mbox": isoResWidget.mboxName+"FS",
            "params" : params,
            "success": function(offers) {
              adobe.target.applyOffer( {
                "mbox": isoResWidget.mboxName+"FS",
                "offer": offers
              });
            },
            "error" : function(){

            }
          });
          adobe.target.getOffer({
            "mbox": isoResWidget.mboxName,
            "params" : params,
            "success": function(offers) {
              adobe.target.applyOffer( {
                "mbox": isoResWidget.mboxName,
                "offer": offers
              });
            },
  					"error" : function(){

  					}
          });
        }
      });
    },
    dependsLoaded : function(callback) {
      var mInt = setInterval(function() {
        if (typeof window.adobe !== 'undefined' &&
          typeof window.adobe.target !== 'undefined' &&
          typeof window._satellite !== 'undefined' &&
          typeof window.ttMETA !== 'undefined' &&
  		isoResWidget.depends() !== false) {
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
  isoResWidget.init();
})();
