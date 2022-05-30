
const g_express      = require( "express"       );
const g_cookieParser = require( "cookie-parser" );
const g_bodyParser   = require( "body-parser"   );

const g_mural = require( "./my_mural.js"  );

var g_app = g_express();
g_app.use( g_express.static( __dirname + '/public' ) );
g_app.use( g_bodyParser.json() );
g_app.use( g_bodyParser.urlencoded( { extended: true } ) );
g_app.use( g_cookieParser() );
g_app.set( "view engine", "ejs" );


const PORT = 8080;
g_app.listen( 8080, function()
{
    console.log( "[server] Server running" );

} );


g_app.get( '/', function( request, response )
{
    //console.log( "[server] / ..." );
    //console.log( "[server] / query:\n"   + JSON.stringify( request.query,   null, 3 ) );
    //console.log( "[server] / cookies:\n" + JSON.stringify( request.cookies, null, 3 ) );

    var access_token  = request ? ( request.cookies ? ( request.cookies.access_token  ? request.cookies.access_token  : "" ) : "" ) : "";
    var refresh_token = request ? ( request.cookies ? ( request.cookies.refresh_token ? request.cookies.refresh_token : "" ) : "" ) : "";
    var error_str     = request ? ( request.cookies ? ( request.cookies.error_str     ? request.cookies.error_str     : "" ) : "" ) : "";
    
    if( !access_token && !error_str )
    {
        g_mural.oauth( response );
        return;
    }
    
    response.render( "pages/main", { "access_token"  : access_token,
                                     "refresh_token" : refresh_token,
                                     "error_str"     : error_str } );
    
} );


g_app.get( "/oauth", function( request, response )
{
    //console.log( "[server] /oauth ..." );
    //console.log( "[server] /oauth query:\n"   + JSON.stringify( request.query,   null, 3 ) );
    //console.log( "[server] /oauth cookies:\n" + JSON.stringify( request.cookies, null, 3 ) );
    
    var code = request ? ( request.query ? ( request.query.code ? request.query.code : "" ) : "" ) : "";
    
    g_mural.getAccessToken( code, function( oauth_error_str, access_token, refresh_token )
    {
        response.cookie( "error_str",     oauth_error_str, { httpOnly: true, maxAge: ( 2 * 60 * 60 * 1000 ) } );
        response.cookie( "access_token",  access_token,    { httpOnly: true, maxAge: ( 2 * 60 * 60 * 1000 ) } );
        response.cookie( "refresh_token", refresh_token,   { httpOnly: true, maxAge: ( 2 * 60 * 60 * 1000 ) } );
        
        response.redirect( "./" );
        
    } );
    
} );


