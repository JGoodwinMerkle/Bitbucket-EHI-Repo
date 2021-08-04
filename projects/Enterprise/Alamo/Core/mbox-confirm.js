(function(){
    var isoRes = {
        generateMbox: function(){
            adobe.target.getOffer({
                "mbox": isoRes.confirm.mboxName,
                "params" : isoRes.confirm.params(),
                "success": function(offers) {
                    adobe.target.applyOffer( {
                                "offer": offers,
                                "mbox" : isoRes.confirm.mboxName
                             } );
                    _satellite.logger.log('@@ ResFunnelConfirm mbox generated');
                },
                "error": function(status, error) {
                }
            });
        },
        confirm: {
            mboxName: 'ResFunnelConfirm',
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type &&
                    _analytics.gbo &&
                    _analytics.gbo.reservation &&
                    _analytics.gbo.reservation.pickup_location &&
                    _analytics.gbo.reservation.confirmation_number &&
                    _analytics.gbo.reservation.car_class_details &&
                    _analytics.gbo.reservation.car_class_details.code &&
                    _analytics.gbo.reservation.car_class_details.vehicle_rates[0] &&
                    _analytics.gbo.reservation.car_class_details.vehicle_rates[0].price_summary &&
                    _analytics.gbo.reservation.car_class_details.vehicle_rates[0].price_summary.total_charged){
                        var isAuth = _analytics.gbo && _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic,
                            'pickupId': _analytics.gbo.reservation.pickup_location.id,
                            'orderId' : _analytics.gbo.reservation.confirmation_number,
                            'orderTotal': _analytics.gbo.reservation.car_class_details.vehicle_rates[0].price_summary.total_charged,
                            'productPurchasedId' : _analytics.gbo.reservation.car_class_details.code
                        }
                }
                return false;
            }
        },
        init: function(){
            var paramInt = setInterval(function(){
                // Make sure all the data required in _analytics exists
                if(isoRes.confirm.params() !== false){
                    clearInterval(paramInt);
                    isoRes.generateMbox();
                }
            },100);
        },
        dependenciesLoaded: function(){
            // Clear interval check after 10 seconds in case any dependency fails
            var actTimer = setTimeout(function(){
                clearInterval(actInt);
                _satellite.logger.error('@@ Dependencies FAILED');
                window._analytics ? _satellite.logger.debug('@@ _analytics :: OK') : _satellite.logger.error('@@ _analytics :: Missing');
                window.adobe ? _satellite.logger.debug('@@ adobe :: OK') : _satellite.logger.error('@@ adobe :: Missing');
            }, 10000);

            // Check for all mbox dependencies: Adobe Target library, Analytics object
            var actInt = setInterval(function(){
                _satellite.logger.log('@@ CHECKING dependencies');
                if(window._analytics &&
                    window.adobe &&
                    window.adobe.target){
                        clearInterval(actInt);
                        clearTimeout(actTimer);
                        isoRes.init();
                }
            }, 100);
        }
    }
    isoRes.dependenciesLoaded();
}());