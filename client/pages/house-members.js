const html = require('choo/html')
const _ = require('lodash/fp')
const navbar = require('../elements/navbar')

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
			<table class='uk-table'>
				<thead>
					<tr>
						<th>Member Name</th>
					</tr>
				</thead>
				<tbody>
				${state.members.house
					.filter(function (member) {
						const fullName = member.first_name + member.middle_name + member.last_name
						return fullName.toUpperCase().indexOf(filter.toUpperCase()) !== -1
					})
					.map(function (member) {
						return html`<tr>
							<td>
								${member.first_name} ${member.last_name}
							</td>
						</tr>`
					})
				}
				</tbody>
			</table\>
		</div>
	</div>`
}

module.exports = houseMembers
