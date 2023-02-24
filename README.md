This is an example of how to implement refresh tokens using react and nodejs together.

<img width="747" alt="image" src="https://user-images.githubusercontent.com/40856827/221082235-83a28e3b-970f-4b52-b2a9-d6d8b5aa49ca.png">


The trick to use on the front-end is an interceptor,here is how the entire process works:

1)User enters username and password in the sign in page.<br><br>
2)React makes a request to the backend to /signin and nodejs returns access token and refresh token.<br><br>
3)React then saves the returned access token and refresh token from Nodejs in the local storage.<br><br>
4)When user clicks on the Profile page that is protected, on the react app, the access token already expires because its life span is 5 seconds,axios interceptor, intercepts the request to the /dashboard and makes a request to /refresh on the backend to get a new access token and when the request is made to the /refresh route by react using interceptor,React uses the refresh token that it got from Nodejs when the user signed in.<br><br>
5) Nodejs takes in the request by react on /refresh and checks if the body has the refresh token , and it verifies the refresh token and it the token is valid , nodejs sends back a new access token
6)React gets the new access token and saves it again in the local storage and attaches the new access token i the Authorization header and continuous making request to /dashboard and since the access token is fresh/new ,Nodejs verifies the access token and allows access to /dashboard.
