const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883
const jwt = require('jsonwebtoken');
const jwtKey = "my_secret_key";


const authenticateWithJWT = function(client, username, password, callback){
	// We can obtain the session token from the requests cookies, which come with every request
	
    if( username !== 'JWT' ) { return false; }
    password = password.toString();
    jwt.verify(password, jwtKey, function(err,profile){
        if( err ) {
            console.log(err)
            return callback(null, false)
        }
        console.log("Authenticated client " + profile.username);
        console.log(profile);
        return callback(null, true)
        
      });

}

aedes.authenticate = function (client, username, password, callback) {
    authenticateWithJWT(client, username, password, callback)
  }

aedes.authorizePublish = function (client, packet, callback) {
    if (packet.topic.startsWith("$SYS")) {
        return callback(new Error("$SYS" + ' topic is reserved'))
      }

    if (client.id == "mqtt-explorer-59e433ef" ){
        if (packet.topic === '/sensors/esp2') {
            packet.payload = Buffer.from('overwrite packet payload')
            console.log("published")
        }
        else {
            return callback(new Error('wrong topic'))
        }
        callback(null)
    }

}

aedes.authorizeSubscribe = function (client, sub, callback) {
    if (sub.topic === '/sensors/esp2') {
      return callback(new Error('wrong topic'))
    }
    callback(null, sub)
  }

aedes.on('client', function (client) {
console.log(`CLIENT_CONNECTED : MQTT Client ${(client ? client.id : client)} connected to aedes broker ${aedes.id}`)
})

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})