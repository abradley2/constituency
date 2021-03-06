const html = require('choo/html')
const css = require('sheetify')

const navbar = require('../elements/navbar')

const container = css`
	:host {
		max-width: 700px;
	}
`

function bills() {
	return html`<div>
		${navbar()}
		<div class='${container} center'>
			<h3>Bills</h3>
	</div>`
}

module.exports = function () {
	return bills
}
