const getMemberBills = require('./data/bills-by-member')

module.exports = {
	get: function (req, res, ctx, done) {
		const params = {
			billType: ctx.params.billType,
			memberId: ctx.params.memberId
		}
		getMemberBills(params, ctx, function (err, results) {
			return done(err, results)
		})
	}
}
