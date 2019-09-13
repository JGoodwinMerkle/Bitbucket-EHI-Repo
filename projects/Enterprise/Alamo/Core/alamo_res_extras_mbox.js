// ALAMO:COM: Res Step Extras Mbox

try{
    aReady(function() {
        if (typeof adobe !== 'undefined' && typeof adobe.target !== 'undefined') {
            var mbox = "alamo_res_extras";
            adobe.target.getOffer({
                "mbox": mbox,
                "params": {
                    stationId: _a.stationId,
                    bookingCountry: _a.bookingCountryCode,
                    cid: _a.customerNumber,
                    coupon: _a.couponCode
                },
                "success": function(offers) {
                    adobe.target.applyOffer({
                        "offer": offers,
                        "mbox": mbox
                    });
                },
                "error": function(status, error) {
                    _satellite.logger.warn('@@@ error in script execution || ALAMO:COM: Res Step Extras Mbox || error : ' + error);
                }
            });
        }
    });
} catch(e) {
    _satellite.logger.warn('@@@ error in script execution || ALAMO:COM: Res Step Extras Mbox || error : ' + e.message);
}
