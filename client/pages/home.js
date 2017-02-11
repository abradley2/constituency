const html = require('choo/html')
const css = require('sheetify')
const navbar = require('../elements/navbar')
const states = require('../config/states')

const homeModel = {
	namespace: 'home',
	state: {
	}
}

const stateSelect = css`:host {

}`

function home() {
	return html`<div>
		${navbar()}
		<h3>Welcome to Constituency</h3>
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
