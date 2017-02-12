const html = require('choo/html')
const _ = require('lodash/fp')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')
const textInput = require('../elements/text-input')

function houseMembers(state, prev, send) {
	const filter = state.members.searchFilters.house
	const displayMembers = state.members.house
		.filter(function (member) {
			return (`${member.first_name + member.last_name}`)
				.toUpperCase()
				.indexOf(filter.toUpperCase()) !== -1
		})

	function fetchHouseMembers() {
		send('members:fetchMembers', {chamber: 'house'})
	}

	function setHouseMembersFilter(e) {
		send('members:setFilter', {chamber: 'house', value: e.target.value})
	}

	return html`<div onload=${fetchHouseMembers}>
		${navbar()}
		<div>
			<div class='measure center'>
				${textInput({
					oninput: setHouseMembersFilter,
					value: filter,
					placeholder: 'filter by name...'
				})}
			</div>
			${memberList({
				chamber: 'house',
				members: displayMembers
			})}
		</div>
	</div>`
}

module.exports = function () {
	return houseMembers
}
