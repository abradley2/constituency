const test = require('tape')
const choo = require('choo')

const app = choo()
const sut = require('../../pages/home')(app)

test('pages/home', function (t) {
	const rendered = sut({}, {}, Function.prototype)
	t.ok(rendered)
	t.end()
})
