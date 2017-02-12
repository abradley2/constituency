const localforage = require('localforage')
const series = require('run-series')

const previousStates = []
const previousActions = []

function applyMiddleware(app, done) {
	let previousInitialState
	series([
		function (cb) {
			localforage.getItem('prevLocalstate', function (err, data) {
				if (err) {
					cb(err)
				}
				previousInitialState = data
				cb()
			})
		},
		function (cb) {
			onStateChange(app, cb)
		},
		function (cb) {
			wrapEffects(app, cb)
		},
		function (cb) {
			wrapInitialState(previousInitialState, app, cb)
		}
	], function (err) {
		return done(err, app)
	})
}

if (inDev()) {
	window.$clearLocalState = function () {
		localforage.setItem('localState', '{}')
	}
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

function wrapEffects(app, done) {
	app.use({
		wrapEffects: function (fn) {
			return fn
		}
	})
	done()
}

function onStateChange(app, done) {
	app.use({
		onStateChange: bottleNeck(function (state) {
			// if not in dev, only cache opt-in parts of state
			if (!inDev()) {
				state = Object.keys(state).reduce(function (filtered, stateKey) {
					if (state[stateKey].cache) {
						return Object.assign(filtered, state[stateKey])
					}
					return {}
				}, {})
			}
			localforage.setItem('localState', JSON.stringify(state))
		}, 500)
	})
	app.use({
		onStateChange: function (state, data) {
			previousStates.push(state)
			previousActions.push(data)
			if (previousActions.length > 50) {
				previousActions.shift()
				previousStates.shift()
			}
		}
	})
	done()
}

function inDev() {
	return process.env.NODE_ENV === 'development'
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
