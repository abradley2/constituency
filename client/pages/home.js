const html = require('choo/html')
const css = require('sheetify')
const navbar = require('../elements/navbar')
const states = require('../config/states')

const homeModel = {
	namespace: 'home',
	state: {
	}
}

const stateSelect = css`
	:host {

	}
`

const title = 'mt2 mb0 roboto i fw1 f1 tc'
const subtitle = 'mt2 mb0 f6 fw4 ttu tracked tc'

function home() {
	return html`<div class='center measure'>
		<h1 class=${title}>Constituency</h1>
		<h2 class=${subtitle}>A simple outline of congress</h2>
		${navbar()}
		<select class=${stateSelect}>
			${Object.keys(states).map(function (stateKey) {
				return html`<option>
					${states[stateKey]}
				</option>`
			})}
		</select>
	</div>`
}

module.exports = function (app) {
	app.model(homeModel)
	return home
}
