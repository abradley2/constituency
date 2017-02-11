const request = require('request')

function getMemberPicture(req, res, ctx, done) {
	const config = {
		method: 'GET',
		url: `https://graph.facebook.com/v2.8/${ctx.params.memberId}/picture?redirect=false`
	}

	request(config, function (err, results) {
		done(err, results)
	})
}

module.exports = {
	get: getMemberPicture
}
