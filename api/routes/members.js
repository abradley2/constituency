const request = require('request')

const members = {
	get: function (req, res, ctx, done) {
		const chamber = ctx.params.chamber
		const payload = {
			url: `https://api.propublica.org/congress/v1/114/${chamber}/members.json`,
			headers: {
				'X-API-Key': ctx.localConfig.proPublicaApiKey,
				'Content-Type': 'application/json'
			}
		}

		request(payload, function (err, resp, body) {
			if (err) {
				done(err)
			}
			done(err, body)
		})
	}
}

module.exports = members
