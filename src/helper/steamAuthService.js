const SteamAuth = require("node-steam-openid");
 
const steam = new SteamAuth({
  realm: "http://quickplay.app", // Site name displayed to users on logon
  returnUrl: "http://quickplay.app/auth/steam/authenticate", // Your return route
  apiKey: "01CEB147BCC53C5A227591F42D1065DF" // Steam API key
});

module.exports = steam;