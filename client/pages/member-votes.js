const html = require('choo/html')
const css = require('sheetify')
const xhr = require('xhr')
const i = require('icepick')
const navbar = require('../elements/navbar')

const container = css`
	:host {
		max-width: 700px;
	}
`

const initialState = {
	votes: [],
	shoreMoreVotes: false
}

const memberVotesModel = {
	namespace: 'memberVotes',
	state: initialState,
	reducers: {
		getMemberVotes: function (state, data) {
			return i.set(state, 'votes', data.votes)
		},
		init: function (state) {
			return i.assign(state, initialState)
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

	function init() {
		send('memberVotes:init')
		send('memberVotes:fetchMemberVotes', {memberId: memberId})
	}

	if (prev && prev.location.params.memberId !== state.location.params.memberId) {
		init()
	}

	return html`<div class='center ${container}' onload=${init}>
		${navbar()}
		<h3>member votes</h3>
		<ul class='list pa2'>
			${votes
				.slice(0, state.memberVotes.showMore ? 100 : 15)
				.map(function (vote) {
					return html`<li class='mb5'>
						<span>${vote.bill.title}</span>
					</li>`
				})
			}
		</ul>
	</div>`
}

module.exports = function (app) {
	app.model(memberVotesModel)
	return memberVotes
}
