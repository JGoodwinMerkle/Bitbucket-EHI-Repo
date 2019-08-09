(function() {
  var isoData = {
    mboxName : 'globalData',
		lioDomains : ['com','uk'],
		isLioLoaded : function(){
			// when lytics is enabled for the listed domains check lio object, otherwise set to true
			return isoData.isLioEnabled ? typeof window.lio !== 'undefined' && typeof window.lio.segmentsArray !== 'undefined' && window.lio.segmentsArray.length > 0 : true;
		},
		checkLio : function(){
			var domain = location.hostname.split('.').reverse()[0];
			isoData.isLioEnabled = isoData.lioDomains.indexOf(domain) > -1;
      isoData.brand = location.hostname.toLowerCase().split('.')[1];
		},
    enterpriseLoaded: function(){
      if (typeof window.enterprise !== 'undefined' &&
        typeof window.enterprise.analytics !== 'undefined' &&
        typeof window.enterprise.analytics.pageName !== 'undefined' &&
        typeof window.ReservationStateTree !== 'undefined' &&
        typeof window.ReservationStateTree.data !== 'undefined' &&
        typeof window.ReservationStateTree.data.session !== 'undefined' &&
        typeof window.ReservationStateTree.data.session.reservationSession !== undefined &&
        typeof window.ReservationStateTree !== 'null' &&
        isoData.isLioLoaded()) {
          var authTraffic = false;
          var lioSegments = isoData.isLioEnabled ? window.lio.segmentsArray.toString() : '';
          var pageName = enterprise.analytics.pageName;
          var profile = ReservationStateTree.get(['session','reservationSession','profile']);

        	if (profile) {
            authTraffic = true;
          }

          return {
            'authTraffic' : authTraffic,
            'cdp' : lioSegments,
            'pageType' : pageName
          };
      } else {
        return false;
      }
    },
    nationalcarLoaded: function(){
      if (typeof window._analytics !== 'undefined' &&
        typeof window._analytics.templateName !== 'undefined' &&
        isoData.isLioLoaded()) {
          var lioSegments = isoData.isLioEnabled ? window.lio.segmentsArray.toString() : '';
          var pageName = _analytics.templateName;

          return {
            'cdp' : lioSegments,
            'pageType' : pageName
          };
      } else {
        return false;
      }
    },
    alamoLoaded: function(){
      if (isoData.isLioLoaded()) {
          var lioSegments = isoData.isLioEnabled ? window.lio.segmentsArray.toString() : '';
          return {
            'cdp' : lioSegments
          };
      } else {
        return false;
      }
    },
    init : function() {
      isoData.checkLio();
      isoData.dependsLoaded(function() {
        var params = isoData[isoData.brand+'Loaded']();
        adobe.target.getOffer({
          "mbox": isoData.mboxName,
          "params" : params,
          "success": function(offers) {
            adobe.target.applyOffer( {
              "mbox": isoData.mboxName,
              "offer": offers
            });
            adobe.target.getOffer({
              "mbox": isoData.mboxName+"FS",
		          "params" : params,
		          "success": function(offers) {
		            adobe.target.applyOffer( {
		              "mbox": isoData.mboxName+"FS",
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
      window.clearTimeout(isoData.timer);
      var profile = isoData[isoData.brand+'Loaded']();
      if (typeof window.adobe !== 'undefined' &&
        typeof window.adobe.target !== 'undefined' &&
				profile !== false) {
          if (typeof callback === 'function') {
            callback();
          }
      } else {
        isoData.timer = window.setTimeout(function(){isoData.dependsLoaded(callback);}, 100);
      }
    }
  };
  isoData.init();
})();
