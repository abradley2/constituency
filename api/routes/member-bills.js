const request = require('request')
const series = require('run-series')

function getMemberBillsRequest(req, res, ctx, done) {
	const memberId = ctx.params.memberId
	const billType = ctx.params.billType
	const payload = {
		url: `https://api.propublica.org/congress/v1/members/${memberId}/bills/${billType}.json`,
		headers: {
			'X-API-Key': ctx.localConfig.proPublicaApiKey,
			'Content-Type': 'application/json'
		}
	}
	request(payload, function (err, resp, body) {
		return done(err, body)
	})
}

module.exports = {
	get: function (req, res, ctx, done) {
		let data

		series([
			function (next) {
				getMemberBillsRequest(req, res, ctx, function (err, _data) {
					data = _data
					next(err)
				})
			}
		], function (err) {
			done(err, data)
		})
	}
}
