const http = require('http')
const log = require('merry')().log
const api = require('./api')

log.info({name: 'server'}, 'SERVER_ENV', process.env.NODE_ENV)

const server = http.createServer(handleRequest)

function handleRequest(req, res) {
	if (process.env.NODE_ENV === 'development') {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
		res.setHeader('Access-Control-Allow-Credentials', false)
		res.setHeader('Access-Control-Max-Age', '86400')
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')

		if (req.method.toUpperCase() === 'OPTIONS') {
			res.writeHead(200)
			return res.end('ok')
		}
	}

	return api(req, res)
}

server.listen(3000, function () {
	log.info({name: 'server'}, 'SERVER_START', 'server running on port 3000')
})
