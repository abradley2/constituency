const html = require('choo/html')

const inputStyle = 'input-reset ba b--black-20 pa2 mb2 mw5'

function textInput(props) {
	return html`<input
		type='text'
		oninput=${props.oninput}
		class=${inputStyle}
		placeholder=${props.placeholder || ''}
		value=${props.value}
	>`
}

module.exports = textInput
