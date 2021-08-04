(function(){
  var isoMbox = {
    init : function(){
      document.addEventListener(adobe.target.event.REQUEST_SUCCEEDED, function (e) {
        window.ttMbox= typeof(window.ttMbox)!='undefined' ? window.ttMbox : [];
        var tokens=e.detail.responseTokens;
        if (!isoMbox.isEmpty(tokens)) {
          var uniqueTokens = isoMbox.distinct(tokens);
          uniqueTokens.forEach(function(token) {
            window.ttMbox.push({
              'CampaignName': token["activity.name"],
              'CampaignId' : token["activity.id"],
              'RecipeName': token["experience.name"],
              'RecipeId': token["experience.id"],
              'OfferId': token["option.id"],
              'OfferName': token["option.name"],
              'MboxName': e.detail.mbox
            });
          });
        } else {
          window.ttMbox.push({
              'CampaignName': '',
              'CampaignId' : '',
              'RecipeName': '',
              'RecipeId': '',
              'OfferId': '',
              'OfferName': '',
              'MboxName': e.detail.mbox
            });
        }
      });
    },
    isEmpty : function(val){
      return (val === undefined || val == null || val.length <= 0) ? true : false;
    },
    key : function(obj){
      return Object.keys(obj)
     .map(function(k) { return k + "" + obj[k]; })
     .join("");
    },
    distinct : function(arr){
      var result = arr.reduce(function(acc, e) {
        acc[isoMbox.key(e)] = e;
        return acc;
      }, {});

      return Object.keys(result)
      .map(function(k) { return result[k]; });
    }
  };
  isoMbox.init();
})();