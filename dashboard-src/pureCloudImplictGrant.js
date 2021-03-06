// got this function from one of PureCloud's git repos
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
      results = regex.exec(location.hash);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function redirectToAuth(){
  var queryStringData = {
      response_type : "token",
      client_id : "124e4b8c-b520-4fc0-8f3c-defe6add851a",
      redirect_uri : "http://localhost:8000/"
  }
  window.location.replace("https://login.mypurecloud.com/authorize?" + $.param(queryStringData));
}
function validateToken(token){
  $.ajax({
      url : '/validateToken',
      beforeSend : function(xhr){
        xhr.setRequestHeader("Authorization", "bearer " + token);
      }
  }).done(function(data, statusText, xhr){ // if it is valid, store access_token and use it for all requests
      localStorage.setItem("pureCloudAccessToken", token);
      location.hash='';
  }).fail(redirectToAuth); // if not (token was forged or is no longer valid), redirect to login page
}
// if parameter exists, check against Purecloud to see if valid

// if access_token param is available, use the access token
if(getParameterByName("access_token") != ""){
  validateToken(getParameterByName("access_token"));
}
else{ // else redirect to auth
  redirectToAuth();
}
