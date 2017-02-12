const getVotesByMember = require('./data/votes-by-member')

module.exports = {
	get: function (req, res, ctx, done) {
		const params = {memberId: ctx.params.memberId}
		getVotesByMember(params, ctx, function (err, results) {
			done(err, results)
		})
	}
}
