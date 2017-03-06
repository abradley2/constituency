const votesRollCall = require('./data/votes-roll-call')

function getVote(req, res, ctx, done) {
	const params = {
		chamber: req.params.chamber,
		sessionNumber: req.params.sessionNumber,
		rollCall: req.params.rollCall
	}

	votesRollCall(params, ctx, function (err, results) {
		if (err) {
			ctx.log.error({name: 'api/votes'}, 'VOTES_GET_ONE_ERROR')
			return done(err)
		}

		ctx.log.info({name: 'api/votes'}, 'VOTES_GET_ONE_RESPONSE')
		return done(results)
	})
}

module.exports = {
	getOne: getVote
}
