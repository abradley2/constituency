const fs = require('fs')
const path = require('path')
const merry = require('merry')
const localConfig = require('../local')
const leveldbClient = require('./db/leveldb')

// middleware
const session = require('./middleware/session')
// routes
const members = require('./routes/members')
const memberVotes = require('./routes/member-votes')
const memberBills = require('./routes/member-bills')

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
	['/api/congress/member/:memberId', {
		get: mw([
			setupCtx,
			session,
			members.getOne
		])
	}],
	['/api/congress/members/membervotes/:memberId', {
		get: mw([
			setupCtx,
			session,
			memberVotes.get
		])
	}],
	['/api/congress/members/memberbills/:memberId/:billType', {
		get: mw([
			setupCtx,
			session,
			memberBills.get
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
		ctx.log.error({name: 'api/index'}, 'ERROR', arguments)
		done(null, {error: 'something happened'})
	}]
])

function setupCtx(req, res, ctx, done) {
	Object.assign(ctx, {
		db: leveldbClient,
		localConfig: localConfig,
		log: api.log
	})
	return done()
}

module.exports = api.start()
