const series = require('run-series')
const getMemberInfo = require('./data/member-info')
const getMemberPicture = require('./data/member-picture')
const getMembersList = require('./data/members-list')

module.exports = {
	get: function (req, res, ctx, done) {
		const params = {chamber: ctx.params.chamber}
		getMembersList(params, ctx, function (err, results) {
			done(err, results)
		})
	},
	getOne: function (req, res, ctx, done) {
		let memberInfo
		let memberPicture
		series([
			function (next) {
				const params = {memberId: ctx.params.memberId}
				getMemberInfo(params, ctx, function (err, _memberInfo) {
					if (err) {
						return next(err)
					}
					memberInfo = _memberInfo
					return next()
				})
			},
			function (next) {
				const params = {facebookId: memberInfo.facebook_id}
				getMemberPicture(params, ctx, function (err, _memberPicture) {
					if (err) {
						return next(err)
					}
					memberPicture = _memberPicture
					return next()
				})
			}
		], function (err) {
			if (err) {
				return done(err)
			}
			return done(err, {memberInfo: memberInfo, memberPicture: memberPicture})
		})
	}
}
