const html = require('choo/html')
const css = require('sheetify')
const xhr = require('xhr')

const navbar = require('../elements/navbar')

const voteModel = {
	namespace: 'vote',
	state: {},
	reducers: {},
	effects: {
		fetchVote: function (state, data, send, done) {
			const payload = {
				url: `/api/votes/${data.chamber}/${data.session}/${data.rollCall}`,
				method: 'GET',
				json: true
			}

			xhr.get(payload, function (err, results) {
				if (err) {
					return done(err)
				}

				return send('vote:getVotes', results, done)
			})
		}
	}
}

const container = css`
	:host {
		max-width: 700px;
	}
`

function getVoteId(state) {
	const params = state.location.params
	return `${params.chamber}-${params.session}-${params.rollCall}`
}

function vote(state, prev, send) {
	const chamber = state.location.params.chamber
	const session = state.location.params.session
	const rollCall = state.location.params.rollCall

	const voteId = getVoteId(state)

	function fetchVote() {
		const params = {
			chamber: chamber,
			session: session,
			rollCall: rollCall
		}
		send('vote:fetchVote', params)
	}

	if (prev && voteId !== getVoteId(prev)) {
		fetchVote()
	}

	return html`<div onload=${fetchVote}>
		${navbar()}
		<div class='${container} center'>
			<h3>Votes</h3>
	</div>`
}

module.exports = function (app) {
	app.model(voteModel)
	return vote
}
