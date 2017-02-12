const html = require('choo/html')
const _ = require('lodash/fp')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')
const textInput = require('../elements/text-input')

const senateMembersModel = {
	namespace: 'senateMembers',
	state: {
		filter: ''
	},
	reducers: {
		setFilter: function (state, data) {
			return _.set('filter', data.filter, state)
		}
	}
}

function senateMembers(state, prev, send) {
	const filter = state.senateMembers.filter
	function fetchSenateMembers() {
		send('members:fetchMembers', {chamber: 'senate'})
	}

	function setFilter(e) {
		send('senateMembers:setFilter', {filter: e.target.value})
	}

	return html`<div onload=${fetchSenateMembers}>
		${navbar()}
		<div>
			<div class='measure center'>
				<div>
					${textInput({
						oninput: setFilter,
						value: filter,
						placeholder: 'filter by name...'
					})}
				</div>
			</div>
			${memberList({
				chamber: 'senate',
				members: state.members.senate
					.filter(function (member) {
						return (`${member.first_name + member.last_name}`)
							.toUpperCase()
							.indexOf(filter.toUpperCase()) !== -1
					})
			})}
		</div>
	</div>`
}

module.exports = function (app) {
	app.model(senateMembersModel)
	return senateMembers
}
