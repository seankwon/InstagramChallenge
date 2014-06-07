(function ( win, doc, $ ) {
  /*
   * TODO add some undefined and null checks
   * TODO possibly a loading widget
   */
    win.geoLocator = win.geoLocator || {};

    var imageSrcs = [];
        
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
        printCoordinates: function () {
            return console.log( 'x: ' + selectors.x.val() + ' y: ' + selectors.y.val() );
        },

        callInstagramUrl: function ( url, callback ) {
            $.ajax({
                url: url,
                dataType: 'jsonp',
                cache: false,
                failure: function ( res ) {
                    return console.log("failure");
                },
                success: function ( res ) {
                    return callback( res.data );
                }
            });
        },

        getIdOfNearestLocation: function ( latitude, longitude, callback ) {
            var currUrl = instParams.baseUrl + 'search' + instParams.clientId + 
                          '&lat=' + latitude + '&lng=' + longitude;
            this.callInstagramUrl(currUrl, function ( data ) {
                return callback( data[0]['id'] );
            });
        },

        getImagesOfLocation: function ( latitude, longitude ) {
            var _this = this;

            this.getIdOfNearestLocation( latitude, longitude, function ( id ) {
                var currUrl = instParams.baseUrl + id + '/media/recent' + instParams.clientId;

                _this.callInstagramUrl(currUrl, function ( data ) {
                    return _this.renderInstagramImgs( data );
                });
            });
        },

        renderInstagramImgs: function ( data ) {
            // empty the container
            $('#image-container').html("");
            var imgTemplate;
            var imageUrl = "";

            for ( var i = 0; i < data.length; i++ ) {
                imageUrl = data[i]['images']['thumbnail']['url'];
                imgTemplate = $( $( '#instagram-img' ).html() );
                $( imgTemplate.children( 'img' ) ).attr( 'src', imageUrl );
                $( '#image-container' ).append( imgTemplate );
            }
        }
    };

    $(function () {
        geoLocator.selectors.submitSelector.click(function () {
            geoLocator.handler.getImagesOfLocation(geoLocator.selectors.x.val(), geoLocator.selectors.y.val());
        });
    });

    geoLocator.selectors = selectors;
    geoLocator.instParams = instParams;
    geoLocator.handler = eventHandler;
    geoLocator.imageSrcs = imageSrcs;

    return geoLocator;

}( this, this.document, jQuery ));
