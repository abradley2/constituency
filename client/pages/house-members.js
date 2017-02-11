const html = require('choo/html')
const _ = require('lodash/fp')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')
const states = require('../config/states')

function houseMembers(state, prev, send) {
	const filter = state.members.searchFilters.house

	function fetchHouseMembers() {
		send('members:fetchMembers', {chamber: 'house'})
	}

	function setHouseMembersFilter(e) {
		send('members:setFilter', {chamber: 'house', value: e.target.value})
	}

	return html`<div onload=${fetchHouseMembers}>
		${navbar()}
		<div class='uk-container'>
			<form class='uk-search'>
				<span class='fa fa-2x fa-search'></span>
				<input
					class='uk-search-input'
					type='search'
					value=${filter}
					placeholder=''
					oninput=${setHouseMembersFilter}
				/>
			</form>
			${memberList({
				members: state.members.house
					.filter(function (member) {
						return (`${member.first_name + member.last_name}`)
							.indexOf(filter) !== -1
					})
					.map(function (member) {
						return {
							party: `${member.party}`,
							name: `${member.last_name}, ${member.first_name}`,
							info: `${member.party}, ${states[member.state]}`,
							link: `${member.url}`
						}
					})
			})}
		</div>
	</div>`
}

module.exports = houseMembers
