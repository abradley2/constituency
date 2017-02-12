const html = require('choo/html')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')
const textInput = require('../elements/text-input')

function senateMembers(state, prev, send) {
	const filter = state.members.searchFilters.senate
	function fetchSenateMembers() {
		send('members:fetchMembers', {chamber: 'senate'})
	}

	function setSenateMembersFilter(e) {
		send('members:setFilter', {
			chamber: 'senate',
			value: e.target.value
		})
	}

	return html`<div onload=${fetchSenateMembers}>
		${navbar()}
		<div class='uk-container'>
			<div class='measure center'>
				${textInput({
					oninput: setSenateMembersFilter,
					value: filter,
					placeholder: 'filter by name...'
				})}
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

module.exports = function () {
	return senateMembers
}
