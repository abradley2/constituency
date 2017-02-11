const html = require('choo/html')
const navbar = require('../elements/navbar')
const memberList = require('../elements/member-list')

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
			<form class='uk-search'>
				<span class='fa fa-2x fa-search'></span>
				<input
					class='uk-search-input'
					type='search'
					value=${filter}
					placeholder=''
					oninput=${setSenateMembersFilter}
				/>
			</form>
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
