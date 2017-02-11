const html = require('choo/html')

const title = 'mt2 mb0 roboto i fw1 f1'
const subtitle = 'mt2 mb0 f6 fw4 ttu tracked'
const link = 'f6 f5-l link bg-animate black-80 hover-bg-light-green dib pa3 ph4-l'

function navbar() {
	return html`<header class='bg-white black-80 tc pv4 avenir'>
		<h1 class=${title}>Constituency</h1>
		<h2 class=${subtitle}>A simple outline of congress</h2>
		<nav class='bt bb tc mw7 center mt4'>
			<a class=${link} href='/'>Home</a>
			<a class=${link} href='/page/house'>House of Representatives</a>
			<a class=${link} href='/page/senate'>Senate</a>
		</nav>
</header>`
}

module.exports = navbar
