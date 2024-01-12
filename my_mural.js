
const g_request = require( "request" );


var exports = module.exports = {};
var client_id = "<INSERT CLIENT ID HERE>"
var client_secret = "<INSERT CLIENT SECRET HERE>"
var redirect_uri = "http://localhost:8080/oauth"


exports.oauth = function( response )
{
    var oauthURL = "https://app.mural.co/api/public/v1/authorization/oauth2" +
                   "?client_id="    + client_id +
                   "&redirect_uri=" + redirect_uri +
                   "&scope=murals:read murals:write" +
                   "&response_type=code";
    
    response.redirect( oauthURL );       
}


exports.getAccessToken = function( code, callback )
{
    var tokenURL = "https://app.mural.co/api/public/v1/authorization/oauth2/token";
    
    var options = { method  : "POST",
                    url     : tokenURL,
                    form    : { "client_id"     : client_id, 
                                "client_secret" : client_secret, 
                                "redirect_uri"  : redirect_uri,
                                "code"          : code,
                                "grant_type"    : "authorization_code"
                              }
                  };
    
    g_request( options, function( error, response, body )
    {
        if( error )
        {
            var msg = "Request failed:\n" + error.message;
            callback( msg, "", "" );
            return;
        }

        try
        {
            var body_json = {};
            if( body )
            {
                body_json = JSON.parse( body );
            }
        }
        catch( e )
        {
            var msg = "Processing body caught error:\n";
            if( body.toString().match( /\<html/i ) )
            {
                msg += g_html.convert( body, { wordwrap : 75 } );
            }
            else
            {
                msg += e.stack + "\nbody:\n" + body;
            }
            
            callback( msg, "", "" );
            return;
        }
        
        if( "error" in body_json )
        {
            var msg = "Error getting access token: " + body_json["error"];
            
            if( "error_description" in body_json )
            {
                msg += "\n" + body_json["error_description"];
            }
            
            callback( msg, "", "" );
            return;
        }
        
        if( !( "access_token" in body_json ) || ( "undefined" === typeof body_json["access_token"] ) )
        {
            var msg = "access_token not found in response body";
            callback( msg, "", "" );
            return;
        }
        
        if( !( "refresh_token" in body_json ) || ( "undefined" === typeof body_json["refresh_token"] ) )
        {
            var msg = "refresh_token not found in response body";
            callback( msg, "", "" );
            return;
        }
        
        callback( "", body_json["access_token"], body_json["refresh_token"] );
        
    } );

}


