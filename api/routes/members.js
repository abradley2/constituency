const request = require('request')
const series = require('run-series')

// does a small read to see if the members response has already been cached in
// leveldb. Used to determine if a request to the proPublica api is needed.
function checkCache(req, res, ctx, done) {
	const session = ctx.localConfig.congressSession
	const chamber = ctx.params.chamber
	const delimiter = `members~${session}~${chamber}~`
	const members = []

	ctx.db.createReadStream({
		gt: delimiter + '!',
		lt: delimiter + '~',
		limit: 3
	})
		.on('data', function (data) {
			members.push(data.value)
		})
		.on('error', done)
		.on('end', function () {
			done(null, members.length === 3)
		})
}

// after a request to the proPublica api for congressional members, cache the
// response in leveldb so another proPublica api request for
// this chamber/session isn't needed
function cacheMembers(ctx, members) {
	const session = ctx.localConfig.congressSession
	const chamber = ctx.params.chamber
	const delimiter = `members~${session}~${chamber}~`
	const ops = members.map(function (member) {
		const op = {
			type: 'put',
			key: delimiter + member.id,
			value: member
		}
		return op
	})
	ctx.db.batch(ops, function (err) {
		if (err) {
			return ctx.log.error(err, 'CACHE_MEMBERS_BATCH_ERROR')
		}
		return ctx.log.debug('CACHE_MEMBERS_BATCH_SUCCESS')
	})
}

// retrieve members froom leveldb
function getMembersCache(req, res, ctx, done) {
	const session = ctx.localConfig.congressSession
	const chamber = ctx.params.chamber
	const delimiter = `members~${session}~${chamber}~`
	const members = []

	ctx.db.createReadStream({
		gt: delimiter + '!',
		lt: delimiter + '~'
	})
		.on('data', function (data) {
			members.push(data.value)
		})
		.on('error', done)
		.on('end', function () {
			done(null, {members: members})
		})
}

// retrieve members from proPublica api. This request will trigger
// a cache (cacheMembers) upon completion
function getMembersRequest(req, res, ctx, done) {
	const session = ctx.localConfig.congressSession
	const chamber = ctx.params.chamber
	const payload = {
		url: `https://api.propublica.org/congress/v1/${session}/${chamber}/members.json`,
		headers: {
			'X-API-Key': ctx.localConfig.proPublicaApiKey,
			'Content-Type': 'application/json'
		}
	}

	request(payload, function (err, resp, body) {
		if (err) {
			return done(err)
		}
		try {
			const results = JSON.parse(body).results[0]

			cacheMembers(ctx, JSON.parse(body).results[0].members)

			return done(err, {members: results.members})
		} catch (err) {
			return done(err)
		}
	})
}

const members = {
	get: function (req, res, ctx, done) {
		let cacheHit = false
		let result = {members: []}

		series([
			function (next) {
				checkCache(req, res, ctx, function (err, _cacheHit) {
					cacheHit = _cacheHit
					next(err)
				})
			},
			function (next) {
				if (cacheHit) {
					return getMembersCache(req, res, ctx, function (err, _result) {
						result = _result
						next(err)
					})
				}
				return getMembersRequest(req, res, ctx, function (err, _result) {
					result = _result
					next(err)
				})
			}
		], function (err) {
			if (err) {
				ctx.log.error(err, 'MEMBERS_REQUEST_ERROR')
			}
			done(err, result)
		})
	}
}

module.exports = members
