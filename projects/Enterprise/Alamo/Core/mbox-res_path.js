(function(){
    var isoRes = {
        generateMbox: function(page){
            adobe.target.getOffer({
            "mbox": isoRes[page].mboxName,
            "params" : isoRes[page].params(),
            "success": function(offers) {
                    adobe.target.applyOffer( {
                                "offer": offers ,
                                "mbox": isoRes[page].mboxName
                            } );
                            isoRes[page].generated = true;
                    _satellite.logger.log('@@ ' + isoRes[page].mboxName + ' mbox generated');
                },
                "error": function(status, error) {
                            _satellite.logger.error(error);
                }
         });
        },
        start: {
            mboxName: 'ResFunnelStart',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type){
                        var isAuth = _analytics.gbo && _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic
                        }
                }
                return false;
            }
        },
        map_pickup: {
            mboxName: 'ResFunnelPickup',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type){
                        var isAuth = _analytics.gbo && _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic
                        }
                }
                return false;
            }
        },
        map_return: {
            mboxName: 'ResFunnelDropoff',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type){
                        var isAuth = _analytics.gbo && _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic
                        }
                }
                return false;
            }
        },
        car_select: {
            mboxName: 'ResFunnelCars',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type &&
                    _analytics.gbo &&
                    _analytics.gbo.reservation &&
                    _analytics.gbo.reservation.pickup_location){
                        var isAuth = _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic,
                            'pickupId': _analytics.gbo.reservation.pickup_location.id
                        }
                }
                return false;
            }
        },
        extras: {
            mboxName: 'ResFunnelExtras',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type &&
                    _analytics.gbo &&
                    _analytics.gbo.reservation &&
                    _analytics.gbo.reservation.pickup_location){
                        var isAuth = _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic,
                            'pickupId': _analytics.gbo.reservation.pickup_location.id
                        }
                }
                return false;
            }
        },
        review: {
            mboxName: 'ResFunnelCommit',
            generated: false,
            params: function(){
                if(_analytics.gma &&
                    _analytics.customer_type &&
                    _analytics.gbo &&
                    _analytics.gbo.reservation &&
                    _analytics.gbo.reservation.pickup_location){
                        var isAuth = _analytics.gbo.profile ? true : false;
                        var corpTraffic = _analytics.customer_type == 'CORPORATE' ? true : false;
                        return {
                            'authTraffic': isAuth,
                            'corpTraffic': corpTraffic,
                            'pickupId': _analytics.gbo.reservation.pickup_location.id
                        }
                }
                return false;
            }
        },
        init: function(){
            isoRes.checkParams();
            window.addEventListener('hashchange', isoRes.checkParams, false);
        },
        checkParams: function(){
            var page = location.hash.split('/')[1];
            //Checks the code for the reservation step exists and that the mbox has yet to be created
            if(isoRes[page] !== 'undefined' && !isoRes[page].generated){
                var paramInt = setInterval(function(){
                    // Make sure all the data required in _analytics exists
                    if(isoRes[page].params() !== false){
                        clearInterval(paramInt);
                        isoRes.generateMbox(page);
                    }
                },100);
            } else {
                _satellite.logger.warn('@@ '+ page +' not found or mbox already generated');
            }
        },
        dependenciesLoaded: function(){
            // Clear interval check after 10 seconds in case any dependency fails
            var actTimer = setTimeout(function(){
                clearInterval(actInt);
                _satellite.logger.error('@@ Dependencies FAILED');
                window._analytics ? _satellite.logger.debug('@@ _analytics :: OK') : _satellite.logger.error('@@ _analytics :: Missing');
                window.adobe ? _satellite.logger.debug('@@ adobe :: OK') : _satellite.logger.error('@@ adobe :: Missing');
            }, 25000);

            // Check for all mbox dependencies: Adobe Target library, Analytics object, and actionStore object
            var actInt = setInterval(function(){
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