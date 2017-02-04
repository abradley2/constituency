const css = require('sheetify')
const xhr = require('xhr')
const applyMiddleware = require('./apply-middleware')

css('tachyons')
css('./styles/base.css')

document.addEventListener('DOMContentLoaded', function () {
	const choo = require('choo')
	const home = require('./pages/home')
	const houseMembers = require('./pages/house-members')
	const senateMembers = require('./pages/senate-members')

	const app = choo()

	app.model(require('./models/members'))

	app.router([
		['/', home],
		['/page/house', houseMembers],
		['/page/senate', senateMembers]
	])

	applyMiddleware(app, function () {
		startApp(app)
	})
})

// wrap xhr methods so they automatically use local server when hosted on budo
;['post', 'put', 'patch', 'del', 'head', 'get'].forEach(function (method) {
	xhr[method] = (function (send) {
		return function (config, cb) {
			if (process.env.NODE_ENV === 'development') {
				config.url = `http://localhost:3000${config.url}`
			}
			return send(config, cb)
		}
	})(xhr[method])
})

function startApp(app) {
	document.body.appendChild(app.start())
}
