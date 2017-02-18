const localforage = require('localforage')
const series = require('run-series')

function applyMiddleware(app, done) {
	let previousInitialState
	series([
		// load localState
		function (cb) {
			localforage.getItem('prevLocalstate', function (err, data) {
				if (err) {
					cb(err)
				}
				previousInitialState = data
				cb()
			})
		},
		// combine initialState with localState
		function (cb) {
			wrapInitialState(previousInitialState, app, cb)
		},
		// save localState as state changes
		function (cb) {
			onStateChange(app, cb)
		}
	], function (err) {
		return done(err, app)
	})
}

window.$clearLocalState = function () {
	localforage.setItem('localState', '{}')
}

function wrapInitialState(previousInitialState, app, done) {
	localforage.getItem('localState', function (err, data) {
		if (err) {
			return done(err)
		}
		app.use({
			wrapInitialState: function (initialState) {
				// if the initial state has changed, do not preload it
				if (
					!data ||
					JSON.stringify(previousInitialState) !== JSON.stringify(initialState)
				) {
					return initialState
				}
				const localState = JSON.parse(data)
				Object.keys(initialState)
					.filter(function (stateKey) {
						return stateKey !== 'location'
					})
					.forEach(function (stateKey) {
						initialState[stateKey] = Object.assign(
							initialState[stateKey],
							localState[stateKey]
						)
					})
				return initialState
			}
		})
		done()
	})
}

function onStateChange(app, done) {
	app.use({
		onStateChange: bottleNeck(function (state) {
			localforage.setItem('localState', JSON.stringify(state))
		}, 500)
	})
	done()
}

function bottleNeck(func, time) {
	let lastArgs = []
	let pending = false
	function debounced() {
		lastArgs = arguments
		if (pending) {
			clearTimeout(pending)
		}
		pending = setTimeout(function () {
			func.apply({}, lastArgs)
		}, time)
	}
	return debounced
}

module.exports = applyMiddleware
