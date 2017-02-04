const html = require('choo/html')
const navbar = require('../elements/navbar')

function houseMembers(state, prev, send) {
	function fetchHouseMembers() {
		send('members:fetchMembers', {chamber: 'house'})
	}

	return html`<div onload=${fetchHouseMembers}>
		${navbar()}
		<div class='uk-container'>
			<table class='uk-table'>
				<thead>
					<tr>
						<th>Member Name</th>
					</tr>
				</thead>
				<tbody>
				${state.members.house.map(function (member) {
					return html`<tr>
						<td>
							${member.first_name} ${member.last_name}
						</td>
					</tr>`
				})}
				</tbody>
			</table\>
		</div>
	</div>`
}

module.exports = houseMembers
