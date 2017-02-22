const html = require('choo/html')
const _ = require('lodash/fp')
const xhr = require('xhr')
const navbar = require('../elements/navbar')
const profileCard = require('../elements/profile-card')

const memberProfileModel = {
	namespace: 'memberProfile',
	state: {
		memberVotes: null,
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
		getMemberVotes: function (state, data) {
			return _.set('memberVotes', data.memberVotes, state)
		},
		setActiveTab: function (state, data) {
			return _.set('activeTab', data.activeTab, state)
		}
	},
	effects: {
		fetchMemberVotes: function (state, data, send, done) {
			const config = {
				url: `/api/congress/members/membervotes/${data.memberId}`,
				json: true
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					return done(err)
				}
				const votes = body.votes
				return send('memberProfile:getMemberVotes', {memberVotes: votes}, done)
			})
		},
		fetchMemberInfo: function (state, data, send, done) {
			const config = {
				url: `/api/congress/member/${data.memberId}`,
				json: true
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					return done(err)
				}
				return send('memberProfile:getMemberInfo', body, done)
			})
		}
	}
}

function homeMemberProfile(state, prev, send) {
	const memberId = state.location.params.memberId
	const memberPicture = state.memberProfile.memberPicture
	const memberInfo = state.memberProfile.memberInfo

	function getMemberInfo() {
		send('memberProfile:fetchMemberInfo', {memberId: memberId})
	}

	function getMemberVotes() {
		send('memberProfile:fetchMemberVotes', {memberId: memberId})
	}

	if (prev && prev.location.params.memberId !== state.location.params.memberId) {
		getMemberInfo()
	}

	return html`<div onload=${getMemberInfo}>
		${navbar()}
		${memberInfo ?
			html`<div class='measure center'>
				${profileCard({
					image: memberPicture ? memberPicture.url : null,
					member: memberInfo
				})}
				<div class='relative'>
					</div>
					<div
						onclick=${getMemberVotes}
						class='pointer w4 tc link pa3 ba b--black-20'
					>
						Votes
					</div>
				</div>
			</div>` :
			null
		}
	</div>`
}

module.exports = function (app) {
	app.model(memberProfileModel)
	return homeMemberProfile
}
