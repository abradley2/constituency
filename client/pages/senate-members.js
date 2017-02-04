const html = require('choo/html')
const navbar = require('../elements/navbar')

function senateMembers(state, prev, send) {
	function fetchSenateMembers() {
		send('members:fetchMembers', {chamber: 'senate'})
	}

	return html`<div onload=${fetchSenateMembers}>
		${navbar()}
		<div class='uk-container'>
			<table class='uk-table'>
				<thead>
					<tr>
						<th>Member Name</th>
					</tr>
				</thead>
				<tbody>
				${state.members.senate.map(function (member) {
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

module.exports = senateMembers
