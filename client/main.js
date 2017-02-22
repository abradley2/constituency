const choo = require('choo')
const css = require('sheetify')
const xhr = require('xhr')
const applyMiddleware = require('./apply-middleware')

css('tachyons')
css('./styles/base.css')

const app = choo()

if (process.env.NODE_ENV === 'development') {
	const log = require('choo-log')
	app.use(log())
}

const home = require('./pages/home')(app)
const members = require('./pages/members')(app)
const houseMemberProfile = require('./pages/house-member-profile')(app)

app.router([
	['/', home],
	['/page/members/:chamber', members],
	['/page/house/member/:memberId', houseMemberProfile]
])

applyMiddleware(app, function () {
	startApp(app)
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
