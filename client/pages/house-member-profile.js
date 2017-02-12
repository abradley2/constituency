const html = require('choo/html')
const _ = require('lodash/fp')
const xhr = require('xhr')
const navbar = require('../elements/navbar')
const profileCard = require('../elements/profile-card')

const houseMemberProfileModel = {
	namespace: 'houseMemberProfile',
	state: {
		memberInfo: null,
		memberPicture: null,
		activeTab: 0
	},
	reducers: {
		getMemberInfo: function (state, data) {
			return _.compose(
				_.set('memberInfo', data.memberInfo),
				_.set('memberPicture', data.memberPicture)
			)(state)
		},
		setActiveTab: function (state, data) {
			return _.set('activeTab', data.activeTab, state)
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
	const memberPicture = state.houseMemberProfile.memberPicture
	const memberInfo = state.houseMemberProfile.memberInfo
	console.log(memberPicture, state.houseMemberProfile)
	function getMemberInfo() {
		send('houseMemberProfile:fetchMemberInfo', {memberId: memberId})
	}

	return html`<div onload=${getMemberInfo}>
		${navbar()}
		${memberInfo ?
			html`<div class='measure center'>
				${profileCard({
					image: memberPicture ? memberPicture.url : null,
					member: memberInfo
				})}
				<h3 onload=${getMemberInfo}>
					Member
				</h3>
			</div>` :
			null
		}
	</div>`
}

module.exports = function (app) {
	app.model(houseMemberProfileModel)
	return homeMemberProfile
}
