const html = require('choo/html')
const navbar = require('../elements/navbar')

function home() {
	return html`<div>
		${navbar()}
		<h3>Welcome to Constituency</h3>
	</div>`
}

module.exports = home
