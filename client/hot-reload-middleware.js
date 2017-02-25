const localforage = require('localforage')
const series = require('run-series')
const deepEqual = require('deep-equal')

window.$clearLocalState = function () {
	localforage.setItem('localState', '{}')
	localforage.setItem('prevInitialState', '{}')
}

function hotReloadMiddleware(app, done) {
	let prevInitialState
	let localState
	series([
		// load prevInitialState
		function (cb) {
			localforage.getItem('prevInitialState', function (err, data) {
				if (err) {
					cb(err)
				}
				prevInitialState = JSON.parse(data)
				cb()
			})
		},
		// load localState
		function (cb) {
			localforage.getItem('localState', function (err, data) {
				if (err) {
					cb(err)
				}
				localState = JSON.parse(data)
				cb()
			})
		},
		// conditionally combine localState with initialState
		function (cb) {
			wrapInitialState(prevInitialState, localState, app, cb)
		},
		// save localState as state changes
		function (cb) {
			onStateChange(app, cb)
		}
	], function (err) {
		if (err) {
			window.$clearLocalState()
		}
		return done(err)
	})
}

function wrapInitialState(prevInitialState, localState, app, done) {
	app.use({
		wrapInitialState: function (state) {
			localforage.setItem('prevInitialState', JSON.stringify(state))
			// if the initial state has changed, do not preload it
			if (!prevInitialState || !deepEqual(prevInitialState, state)) {
				localforage.setItem('localState', JSON.stringify(state))
				localforage.setItem('prevInitialState', JSON.stringify(state))
				return state
			}
			Object.keys(localState)
				.filter(function (stateKey) {
					return stateKey !== 'location'
				})
				.forEach(function (stateKey) {
					state[stateKey] = localState[stateKey]
				})

			return state
		}
	})
	done()
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

module.exports = hotReloadMiddleware
