const request = require('request')

function getMemberBillsRequest(params, ctx, done) {
	const memberId = params.memberId
	const billType = params.billType
	const payload = {
		url: `https://api.propublica.org/congress/v1/members/${memberId}/bills/${billType}.json`,
		method: 'GET',
		headers: {
			'X-API-Key': ctx.localConfig.proPublicaApiKey,
			'Content-Type': 'application/json'
		}
	}
	request(payload, function (err, resp, body) {
		return done(err, body)
	})
}

module.exports = getMemberBillsRequest
