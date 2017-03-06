const request = require('request')

function votesRollCall(params, ctx, done) {
	const baseUrl = 'https://api.propublica.org/congress/v1/'
	const session = params.session
	const rollCall = params.rollCall
	const chamber = params.chamber
	const congressSession = ctx.localConfig.congressSession

	const payload = {
		url: `${baseUrl}${congressSession}/${chamber}/sessions/${session}/votes/${rollCall}`,
		method: 'GET',
		headers: {
			'X-API-Key': ctx.localConfig.proPublicaApiKey,
			'Content-Type': 'application/json'
		}
	}

	return request(payload, function (err, resp, body) {
		if (err) {
			return done(err)
		}
		try {
			return done(err, JSON.parse(body).results.votes)
		} catch (err) {
			done(err)
		}
	})
}

module.exports = votesRollCall
