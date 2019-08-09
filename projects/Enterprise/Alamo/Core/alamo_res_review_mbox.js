aReady(function() {
  if (typeof adobe !== 'undefined' && typeof adobe.target !== 'undefined') {
    var mbox = "alamo_res_review";
    adobe.target.getOffer({  
      "mbox": mbox,
      "params" : {
          stationId: _a.stationId
        },
      "success": function(offers) {          
        adobe.target.applyOffer( { "offer": offers, "mbox": mbox } );
      },  
      "error": function(status, error) {          

      }
    });
  }
});