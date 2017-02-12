const request = require('request')

function getMemberPicture(params, ctx, done) {
	const config = {
		method: 'GET',
		url: `https://graph.facebook.com/v2.8/${params.facebookId}/picture?width=300&redirect=false`
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
