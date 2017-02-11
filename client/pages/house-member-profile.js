const html = require('choo/html')
const _ = require('lodash/fp')
const series = require('run-series')
const xhr = require('xhr')

const houseMemberProfileModel = {
	namespace: 'houseMemberProfile',
	state: {
		memberInfo: {},
		memberPicture: ''
	},
	reducers: {
		getMemberInfo: function (state, data) {
			return _.assign(data, state)
		}
	},
	effects: {
		fetchMemberInfo: function (state, data, send, done) {
			let memberVotes
			let memberPicture
			series([
				function (cb) {
					const config = {
						url: `/api/congress/members/membervotes/${data.memberId}`,
						json: true,
						headers: {
							'Content-Type': 'application/json'
						}
					}
					xhr.get(config, function (err, resp, body) {
						if (err) {
							return cb(err)
						}
						memberVotes = body
						cb(err)
					})
				},
				function (cb) {
					xhr.get({
						url: `/api/congress/membmers/memberpictures/${data.facebookId}`,
						json: true
					}, function (err, resp, body) {
						if (err) {
							cb(err)
						}
						memberPicture = body.memberPicture
						cb(err)
					})
				}
			], function (err) {
				if (err) {
					done(err)
				}
				const params = {
					memberVotes: memberVotes,
					membmerPicture: memberPicture
				}
				send('houseMemberProfile:getMemberInfo', params)
			})
		}
	}
}

function homeMemberProfile(state, prev, send) {
	const memberId = state.location.params.memberId
	function getMemberInfo() {
		send('houseMemberProfile:fetchMemberInfo', {memberId: memberId})
	}

	return html`<h3 onload=${getMemberInfo}>
		Member
	</h3>`
}

module.exports = function (app) {
	app.model(houseMemberProfileModel)
	return homeMemberProfile
}
