const html = require('choo/html')
const css = require('sheetify')

const somePadding = css`:host {
	padding: 15px;
}`

const messageText = css`:host {
	color: var(--color-success);
}`

function home(state, prev, send) {
	function updateMessage(e) {
		send('home:UPDATE_MESSAGE', {message: e.target.value})
	}

	function sendMessage() {
		send('home:SEND_MESSAGE')
	}

	return html`<div class=${somePadding + ' pure-form'}>
		<h3 class=${messageText}>${state.home.message}</h3>
		<a href='/page/about'>About</a>
		<div></div>
		<fieldset class='pure-form'>
			<input value=${state.home.message} oninput=${updateMessage}/>
		</fieldset>
		<button
			class='pure-button pure-button-primary'
			onclick=${sendMessage}
		>
			Send Message
		</button>
	</div>`
}

module.exports = home
