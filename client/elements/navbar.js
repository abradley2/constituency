const html = require('choo/html')

function navbar() {
	return html`<nav class='uk-navbar-container' uk-navbar>
		<nav class='uk-navbar-center'>
			<ul class='uk-navbar-nav'>
				<li>
					<a href='/'>Home</a>
				</li>
				<li>
					<a href='/page/house'>House</a>
				</li>
				<li>
					<a href='/page/senate'>Senate</a>
				</li>
			</ul>
		</nav>
	</nav>`
}

module.exports = navbar
