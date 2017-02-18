const request = require('request')

function getMemberPicture(params, ctx, done) {
	const qs = '?height=300&width=300&redirect=false'
	const config = {
		method: 'GET',
		url: `https://graph.facebook.com/v2.8/${params.facebookId}/picture${qs}`
	}

	request(config, function (err, resp, body) {
		try {
			const results = JSON.parse(body).data
			return done(err, results)
		} catch (err) {
			return done(err)
		}
	})
}

module.exports = getMemberPicture
