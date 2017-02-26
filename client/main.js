const choo = require('choo')
const css = require('sheetify')
const xhr = require('xhr')

css('tachyons')
css('./styles/base.css')

const app = choo()

const home = require('./pages/home')(app)
const members = require('./pages/members')(app)
const memberProfile = require('./pages/member-profile')(app)
const memberVotes = require('./pages/member-votes')(app)

app.router([
	['/', home],
	['/page/members/:chamber', members],
	['/page/member/:memberId', memberProfile],
	['/page/member/votes/:memberId', memberVotes]
])

function startApp(app) {
	document.body.appendChild(app.start())
}

// Production startup
if (process.env.NODE_ENV === 'production') {
	startApp(app)
}

// Development startup
if (process.env.NODE_ENV === 'development') {
	const log = require('choo-log')
	app.use(log())

	require('./hot-reload-middleware')(app, function () {
		startApp(app)
	})

	// In development, wrap xhr methods so they use the local server
	const methods = ['post', 'put', 'patch', 'del', 'head', 'get']

	methods.forEach(function (method) {
		xhr[method] = (function (send) {
			return function (config, cb) {
				config.url = `http://localhost:3000${config.url}`
				return send(config, cb)
			}
		})(xhr[method])
	})
}
