const html = require('choo/html')

function votes() {
	return html`<div>
		<h3>Votes</h3>
	</div>`
}

module.exports = function () {
	return votes
}
