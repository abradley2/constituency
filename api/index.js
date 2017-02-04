const fs = require('fs')
const path = require('path')
const merry = require('merry')
const localConfig = require('../local')
const leveldbClient = require('./db/leveldb')
const redisClient = require('./db/redis')
// middleware
const session = require('./middleware/session')
// routes
const members = require('./routes/members')

const mw = merry.middleware
const notFound = merry.notFound()
const api = merry()

api.router([
	['/api/congress/members/:chamber', {
		get: mw([
			setupCtx,
			session,
			members.get
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
		ctx.log.error('ERROR', arguments)
		done(null, {error: 'something happened'})
	}]
])

function setupCtx(req, res, ctx, done) {
	Object.assign(ctx, {
		db: leveldbClient,
		rs: redisClient,
		localConfig: localConfig,
		log: api.log
	})
	return done()
}

module.exports = api.start()
