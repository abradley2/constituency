const html = require('choo/html')

const link = 'f6 f5-l link bg-animate black-80 hover-bg-light-green dib pa3 ph4-l'

function navbar() {
	return html`<header class='bg-white black-80 tc mb4'>
		<nav class='bt bb tc mw7 center mt4'>
			<a class=${link} href='/'>Home</a>
			<a class=${link} href='/votes'>Votes</a>
			<a class=${link} href='/bills'>Bills</a>
			<a class=${link} href='/members/house'>House of Representatives</a>
			<a class=${link} href='/members/senate'>Senate</a>
		</nav>
</header>`
}

module.exports = navbar
