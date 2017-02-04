const redis = require('redis')
const localConfig = require('../../local')

const rs = redis.createClient({
	port: localConfig.redisPort || 6379
})

module.exports = rs
