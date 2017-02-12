const html = require('choo/html')
const states = require('../config/states')

const partyMap = {
	R: 'Republican',
	D: 'Democrat'
}

function profileCard(props) {
	const member = props.member
	const currentRole = member.roles[0]
	const name = `${member.first_name} ${member.middle_name} ${member.last_name}`
	return html`<article class='relative ba b--black-20 mw5 center'>
		${props.image ?
			html`<img class='db' src=${props.image}></img>` :
			null
		}
		<div class='pa2 bt b--black-20'>
			<span class='f6 db'>
				${name}
			</span>
			<p class='f6 gray mv1'>${partyMap[currentRole.party] || ''} ${currentRole.title}</p>
			<p class='f6 gray mv1'>${states[currentRole.state]}</p>
		</div>
	</article>`
}

module.exports = profileCard
