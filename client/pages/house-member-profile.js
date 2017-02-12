const html = require('choo/html')
const _ = require('lodash/fp')
const css = require('sheetify')
const xhr = require('xhr')
const navbar = require('../elements/navbar')
const profileCard = require('../elements/profile-card')

const votesDisplay = css`:host {
	position: absolute;
	top: -400px;
	height: 400px;
	width: 300px;
	background-color: blue;
}`

const houseMemberProfileModel = {
	namespace: 'houseMemberProfile',
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
				return send('houseMemberProfile:getMemberVotes', {memberVotes: votes}, done)
			})
		},
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

	function getMemberInfo() {
		send('houseMemberProfile:fetchMemberInfo', {memberId: memberId})
	}

	function getMemberVotes() {
		send('houseMemberProfile:fetchMemberVotes', {memberId: memberId})
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
				<div class='relative'>
					<div class=${votesDisplay}>
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
	app.model(houseMemberProfileModel)
	return homeMemberProfile
}
