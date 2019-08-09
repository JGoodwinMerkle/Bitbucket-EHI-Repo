aReady(function() {
  var targetOrderID = _a.reservationConfirmationNumber,
      targetProductSKU = _a.reservationCarClass,
      targetOrderTotal = _a.reservationSubtotal,
      targetReservationPrepaid = _a.reservationPrepaid,
      addOnItems = (_a.reservationOptions && _a.coverageProducts !== '') ? _a.reservationOptions + '_' + _a.coverageProducts : _a.reservationOptions + _a.coverageProducts,
  		targetAddOnSKU = addOnItems.split('_').join(','),
      reservationLength = _a.reservationLength,
      reservationLORPUD = _a.reservationLORPUD,
      leadTime = _a.reservationLeadTime,
      pickupStation = _a.stationId,
      countryOfResidenceCode = _a.countryResidenceCode,
      bookingCountryCode = _a.bookingCountryCode,
      targetAddOnTotal = _a.reservationOptionsCharge,
      targetVehicleDailyRate = _a.reservationUnitRate,
      reservationPickupDate = _a.reservationPickupDate,
      reservationPickupDay = _a.reservationPickupDay,
      reservationDropoffDate = _a.reservationDropoffDate,
      aiModalCookie = _satellite.getVar('AI Modal Cookie'),
      couponCode = _a.couponCode;
      adobe.target.getOffer({  
        "mbox": 'OrderConfirm',
        "params" : {
          'orderId' : targetOrderID,
          'orderTotal' : targetOrderTotal,
          'productPurchasedId' : targetProductSKU + '|' + targetAddOnSKU + '|' + pickupStation + '|' + reservationLength + '|' + targetReservationPrepaid + '|' + leadTime + '|' + aiModalCookie,
          //'prePaid' : targetReservationPrepaid,
          //'reservationLength' : reservationLength,
          //'reservationLORPUD' : reservationLORPUD,
          //'leadTime' : leadTime,
          //'pickupStation' : pickupStation,
          //'countryOfResidenceCode' : countryOfResidenceCode,
          //'bookingCountryCode' : bookingCountryCode,
          //'addOns' : targetAddOnSKU,
          //'addOnRevenue' : targetAddOnTotal,
          //'vehicleUnitRate' : targetVehicleDailyRate,
          //'reservationPickupDate' : reservationPickupDate,
          //'reservationPickupDay' : reservationPickupDay,
          //'reservationDropoffDate' : reservationDropoffDate,
          //'couponCode' : couponCode
        },
        "success": function(offers) {
          adobe.target.applyOffer( { "offer": offers } );
        },  
        "error": function(status, error) {          
          
        }
      });
}, false);