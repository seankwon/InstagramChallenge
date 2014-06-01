(function ( win, doc, $ ) {
  /*
   * TODO add some undefined and null checks
   * TODO possibly a loading widget
   */
  win.geoLocator = win.geoLocator || {};

  var instParams = ( function () {
    var clientId = '?client_id=15d5ec71f3564e06ba6017c3f26eb3ac'
    var baseUrl = 'https://api.instagram.com/v1/locations/';

    return { clientId: clientId, baseUrl: baseUrl };
  }());

  var selectors = ( function () {
    var latitude = $( '#latitude' );
    var longitude = $( '#longitude' );
    var submitBtn = $( '#submit-coordinates' ) 
    
    return {
      x: latitude,
      y: longitude,
      submitSelector: submitBtn
    };
  }());

  var eventHandler = {
    _this: this,

    printCoordinates: function () {
      console.log( 'x: ' + selectors.x.val() + ' y: ' + selectors.y.val() );
    },

    callInstagramUrl: function ( url, callback ) {
      // callback function on success? or complete?
      $.ajax({
        url: url,
        dataType: 'jsonp',
        cache: false,
        success: function ( res ) {
          return callback( res.data );
        }
      });
    },

    getIdOfNearestLocation: function ( latitude, longitude, callback ) {
      var currUrl = instParams.baseUrl + 'search' + instParams.clientId + 
                    '&lat=' + latitude + '&lng=' + longitude;
      console.log(currUrl);
      this.callInstagramUrl(currUrl, function ( data ) {
        return callback( data[0]['id'] );
      });
    },


    getImagesOfLocation: function ( latitude, longitude ) {
      var _this = this;
      var imageUrl = "";
      // empty the container
      $('#image-container').html("");

      this.getIdOfNearestLocation( latitude, longitude, function ( id ) {

        var currUrl = instParams.baseUrl + id + '/media/recent' + instParams.clientId;
        console.log(currUrl);

        _this.callInstagramUrl(currUrl, function ( data ) {
          var imgTemplate;
          console.log(data);

          //TODO this can be separated into 3 functions maybe
          for ( var i = 0; i < data.length; i++ ) {
            imageUrl = data[i]['images']['thumbnail']['url'];
            imgTemplate = $($('#instagram-img').html());
            $(imgTemplate.children('img')).attr('src', imageUrl);
            $('#image-container').append(imgTemplate);
          }
        });
      });
    },

    displayInstagramImgs: function () {
      //FIXME dearest sean, you can use this when you remember how javascript scoping
      //FIXME works >:[
      
      var imgTemplate;
      for (var i = 0; i < selectors.images.length; i++) {
        imgTemplate = $($('#instagram-img').html());
        $(imgTemplate.children('img')).attr('src', selectors.images[i]);
        $('#image-container').append(imgTemplate);
      }
    }

  };

  $(function () {
    geoLocator.selectors.submitSelector.click(function () {
      geoLocator.handler.getImagesOfLocation(geoLocator.selectors.x.val(), geoLocator.selectors.y.val());
      //setTimeout(geoLocator.handler.displayInstagramImgs(), 2000);
    });
  });

  geoLocator.selectors = selectors;
  geoLocator.instParams = instParams;
  geoLocator.handler = eventHandler;
  geoLocator.images = images;

}( this, this.document, jQuery ));
