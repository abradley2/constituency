const fs = require('fs')
const path = require('path')
const merry = require('merry')
const localConfig = require('../local')
// middleware
const session = require('./middleware/session')
// routes
const message = require('./routes/message')

const mw = merry.middleware
const notFound = merry.notFound()
const api = merry()

api.router([
	['/api/message', {
		get: mw([
			setupCtx,
			session,
			message.get
		])
	}],
	['/404', function (req, res, ctx, done) {
		if (req.url.indexOf('/page') !== -1) {
			return fs.createReadStream(path.join(__dirname, '../public/index.html'))
				.pipe(res)
		}
		return notFound(req, res, ctx, done)
	}],
	['/error', function (req, res, ctx, done) {
		api.log.error('ERROR', arguments)
		done(null, {error: 'something happened'})
	}]
])

function setupCtx(req, res, ctx, done) {
	Object.assign(ctx, {
		localConfig: localConfig,
		log: api.log
	})
	return done()
}

module.exports = api.start()
