const css = require('sheetify')
const xhr = require('xhr')
const applyMiddleware = require('./apply-middleware')

css('tachyons')
css('./styles/base.css')

document.addEventListener('DOMContentLoaded', function () {
	const choo = require('choo')

	const app = choo()

	if (process.env.NODE_ENV === 'development') {
		const log = require('choo-log')
		app.use(log())
	}

	const home = require('./pages/home')(app)
	const houseMembers = require('./pages/house-members')(app)
	const houseMemberProfile = require('./pages/house-member-profile')(app)
	const senateMembers = require('./pages/senate-members')(app)

	app.model(require('./models/members'))

	app.router([
		['/', home],
		['/page/house', houseMembers],
		['/page/house/member/:memberId', houseMemberProfile],
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
