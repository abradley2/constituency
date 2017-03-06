const test = require('tape')
const choo = require('choo')
const hyperx = require('hyperx')

const html = hyperx(pojo)

const app = choo()
const sut = require('../../pages/home')(app)

test('pages/home', function (t) {
	const rendered = sut({}, {}, Function.prototype)
	const parsed = html([rendered.outerHTML.toString()])

	t.ok(rendered)
	t.ok(parsed)
	t.end()
})

function pojo(tag, attributes, children) {
	return {
		tag: tag,
		attributes: attributes,
		children: children
	}
}
