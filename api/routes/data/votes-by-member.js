const request = require('request')

function votesByMember(params, ctx, done) {
	const memberId = params.memberId
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

module.exports = votesByMember
