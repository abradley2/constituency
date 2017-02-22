const html = require('choo/html')
const states = require('../config/states')

const list = 'list pl0 mt0 measure center overflow-y-auto'
const listItem = 'flex items-center lh-copy pa3 ph0-l bb b--black-10'
const listItemTitleGroup = 'pl3 flex-auto link'
const listItemTitle = 'f6 db black-70'
const listItemLink = 'f6 link blue hover-dark-gray'

const partyMap = {
	D: 'blue',
	R: 'red'
}

function memberList(props) {
	return html`<ul class=${list}>
		${props.members.map(function (member) {
			const icon = partyMap[member.party] || 'green'
			const link = '/page/member/' + member.id
			const params = {
				name: `${member.last_name}, ${member.first_name}`,
				info: `${member.party}, ${states[member.state]}`
			}

			return html`<li class=${listItem}>
				<i class=${'fa fa-user fa-2x ' + icon}></i>
				<a class=${listItemTitleGroup} href=${link}>
					<div class=${listItemTitle}>${params.name}</div>
					<div class=${listItemTitle}>${params.info}</div>
				</a>
				<div>
					<a class=${listItemLink} href=${member.url}>
						<i class='fa fa-2x fa-external-link'></i>
				</div>
			</li>`
		})}
	</ul>`
}

module.exports = memberList
