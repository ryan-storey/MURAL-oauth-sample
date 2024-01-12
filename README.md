# MURAL OAuth 2.0 Simple Sample

Set up for Genie instructions:
https://developers.mural.co/public/docs/register-your-app

Follow these instructions and name your app 'genie-test'.
Copy the client id and secret into the two variables on lines 6 and 7 of my_mural.js

Copy the value of the redirect_uri variable of line 8 (should be 'http://localhost:8080/oauth') into the 'Redirect URLs' field under the OAuth section.

Click save.

In your terminal run 'node server.js' under this directory. You might need to run 'npm install express'.

In your browser, go to 'http:localhost:8080'. It should redirect you to mural. Authorize, and you should see two tokens, an Access Token, and a Refresh Token. We can automate this with curl.

<p>&nbsp;</p>
