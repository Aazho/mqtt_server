const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 40;

function generateAccessToken(username) {
    const payload = {
        username: username,
    };
    const secret = 'my_secret_key';
    return jwt.sign(payload, secret);
}

const authenticateWithJWT = function(client, username, password, callback){
	// We can obtain the session token from the requests cookies, which come with every request
	
    if( username !== 'JWT' ) { return callback("Invalid Credentials", false); }

    jwt.verify(password, jwtKey, function(err,profile){
        if( err ) { return callback("Error getting UserInfo", false); }
        console.log("Authenticated client " + profile.user_id);
        console.log(profile.topics);
        client.deviceProfile = profile;
        return callback(null, true);
      });

}


console.log(generateAccessToken("ayoub"))