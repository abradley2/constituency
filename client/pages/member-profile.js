const html = require('choo/html')
const xhr = require('xhr')
const i = require('icepick')
const navbar = require('../elements/navbar')
const profileCard = require('../elements/profile-card')

const memberProfileModel = {
	namespace: 'memberProfile',
	state: {
		memberInfo: null,
		memberPicture: null
	},
	reducers: {
		getMemberInfo: function (state, data) {
			const newState = i.assign(state, {
				memberInfo: data.memberInfo,
				memberPicture: data.memberPicture
			})

			if (state.memberInfo === data.memberInfo) {
				throw new Error('ICEPICK DIDNT WORK')
			}

			return newState
		}
	},
	effects: {
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
					<a
						href='/member/votes/${memberId}'
						class='pointer w4 tc link pa3 ba b--black-20'
					>
						Votes
					</a>
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
