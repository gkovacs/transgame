var redis = require('redis')

var client = redis.createClient()

// multi chain with an individual callback
client.keys("*", function (err, replies) {
console.log(replies)
})
