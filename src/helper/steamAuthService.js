require('dotenv').config();

const SteamAuth = require("node-steam-openid");
 
const steam = new SteamAuth({
  realm: process.env.STEAM_REALM, // Site name displayed to users on logon
  returnUrl: process.env.STEAM_RETURN_URL, // Your return route
  apiKey: process.env.STEAM_API_KEY // Steam API key
});

module.exports = steam;