const html = require('choo/html')
const _ = require('lodash/fp')
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
			const config = {
				url: `/api/congress/members/house/${data.memberId}`,
				json: true
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					return done(err)
				}
				return send('houseMemberProfile:getMemberInfo', body, done)
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
