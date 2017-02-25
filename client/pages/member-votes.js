const html = require('choo/html')
const xhr = require('xhr')
const i = require('icepick')
const navbar = require('../elements/navbar')

const memberVotesModel = {
	namespace: 'memberVotes',
	state: {
		votes: []
	},
	reducers: {
		getMemberVotes: function (state, data) {
			return i.set(state, 'votes', data.votes)
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
				return send('memberVotes:getMemberVotes', {votes: votes}, done)
			})
		}
	}
}

function memberVotes(state, prev, send) {
	const memberId = state.location.params.memberId
	const votes = state.memberVotes.votes

	function getMemberVotes() {
		return send('memberVotes:fetchMemberVotes', {memberId: memberId})
	}

	if (prev && prev.location.params.memberId !== state.location.params.memberId) {
		getMemberVotes()
	}

	return html`<div onload=${getMemberVotes}>
		${navbar()}
		<h3>member votes</h3>
		${votes.map(function () {
			return html`<h3>Vote</h3>`
		})}
	</div>`
}

module.exports = function (app) {
	app.model(memberVotesModel)
	return memberVotes
}
