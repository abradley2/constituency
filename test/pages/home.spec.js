const test = require('tape')
const sut = require('../../src/pages/home')

test('pages/home', function (t) {
	const state = {
		home: {
			message: 'Hello World'
		}
	}
	const rendered = sut(state, {}, Function.prototype)
	t.ok(rendered)
	t.end()
})
