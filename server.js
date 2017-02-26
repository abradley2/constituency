const http = require('http')
const nodeStatic = require('node-static')
const api = require('./api')

// API handlers
const apiRequest = new RegExp(/^\/api\/.+$/)
const pageRequest = new RegExp(/^\/page\/.+$/)

const file = new nodeStatic.Server('./public')

const server = http.createServer(handleRequest)

server.listen(3000)

function handleRequest(req, res) {
	// allow cors in dev so requests can be made from budo
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

	if (
		apiRequest.test(req.url) ||
		pageRequest.test(req.url)
	) {
		return api(req, res)
	}

	return file.serve(req, res)
}
