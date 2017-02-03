const html = require('choo/html')

function about() {
	return html`<div>
		<h3>This is the about page</h3>
		<a href='/'>I feel so broke up, I want to go home</a>
	</div>`
}

module.exports = about
