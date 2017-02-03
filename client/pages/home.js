const html = require('choo/html')

function home(state, prev, send) {
	function fetchHouseMembers() {
		send('members:fetchMembers', {chamber: 'house'})
	}

	return html`<div>
		<h3>Welcome to Constituency</h3>
		<button
			onclick=${fetchHouseMembers}
		>
			fetch house members
		</button>
	</div>`
}

module.exports = home
