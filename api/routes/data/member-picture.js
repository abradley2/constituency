const request = require('request')

function getMemberPicture(params, ctx, done) {
	const config = {
		method: 'GET',
		url: `https://graph.facebook.com/v2.8/${params.facebookId}/picture?redirect=false`
	}

	request(config, function (err, results) {
		done(err, results)
	})
}

module.exports = getMemberPicture
