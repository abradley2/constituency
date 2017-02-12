const request = require('request')

function memberInfo(params, ctx, done) {
	const config = {
		url: `https://api.propublica.org/congress/v1/members/${params.memberId}.json`,
		method: 'GET',
		headers: {
			'X-API-Key': ctx.localConfig.proPublicaApiKey,
			'Content-Type': 'application/json'
		}
	}

	request(config, function (err, resp, body) {
		if (err) {
			return done(err)
		}
		try {
			const results = JSON.parse(body).results[0]
			return done(err, results)
		} catch (err) {
			return done(err)
		}
	})
}

module.exports = memberInfo
