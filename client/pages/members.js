const html = require('choo/html')
const xhr = require('xhr')
const _ = require('lodash/fp')
const states = require('../config/states')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')
const textInput = require('../elements/text-input')

const membersModel = {
	namespace: 'members',
	state: {
		house: {
			filter: '',
			members: []
		},
		senate: {
			filter: '',
			members: []
		}
	},
	reducers: {
		getMembers: function (state, data) {
			const editedChamber = _.set('members', data.members, state[data.chamber])

			return _.set(data.chamber, editedChamber, state)
		},
		setFilter: function (state, data) {
			const editedChamber = _.set('filter', data.filter, state[data.chamber])

			return _.set(data.chamber, editedChamber, state)
		}
	},
	effects: {
		fetchMembers: function (state, data, send, done) {
			if (state[data.chamber].length > 0) {
				return
			}
			const config = {
				url: `/api/congress/members/${data.chamber}`,
				json: true,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					done(err)
				}
				const payload = {
					chamber: data.chamber,
					members: body.members
				}
				send('members:getMembers', payload, done)
			})
		}
	}
}

function houseMembers(state, prev, send) {
	const chamber = state.location.params.chamber
	const filter = state.members[chamber].filter
	const displayMembers = state.members[chamber].members
		.filter(function (member) {
			return (`${member.first_name + member.last_name + states[member.state]}`)
				.toUpperCase()
				.indexOf(filter.toUpperCase()) !== -1
		})

	function fetchMembers() {
		send('members:fetchMembers', {chamber: chamber})
	}

	function setFilter(e) {
		send('members:setFilter', {chamber: chamber, filter: e.target.value})
	}

	if (prev && state.location.params.chamber !== prev.location.params.chamber) {
		fetchMembers()
	}

	return html`<div onload=${fetchMembers}>
		${navbar()}
		<div>
			<div class='measure center'>
				${textInput({
					oninput: setFilter,
					value: filter,
					placeholder: 'filter by name or state'
				})}
			</div>
			${memberList({
				chamber: 'house',
				members: displayMembers
			})}
		</div>
	</div>`
}

module.exports = function (app) {
	app.model(membersModel)
	return houseMembers
}
