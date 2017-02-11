const request = require('request')
const series = require('run-series')

function getMemberVotesRequest(req, res, ctx, done) {
	const memberId = ctx.params.memberId
	const payload = {
		url: `https://api.propublica.org/congress/v1/members/${memberId}/votes.json`,
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
			const data = JSON.parse(body)
			return done(err, data.results[0])
		} catch (err) {
			done(err)
		}
	})
}

function getMemberVotes(req, res, ctx, done) {
	let data

	series([
		function (next) {
			getMemberVotesRequest(req, res, ctx, function (err, _data) {
				data = _data
				next(err)
			})
		}
	], function (err) {
		if (err) {
			return done(err)
		}
		done(err, data)
	})
}

module.exports = {
	get: getMemberVotes
}
