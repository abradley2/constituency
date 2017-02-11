const html = require('choo/html')

const list = 'list pl0 mt0 measure center'
const listItem = 'flex items-center lh-copy pa3 ph0-l bb b--black-10'
const listItemTitleGroup = 'pl3 flex-auto'
const listItemTitle = 'f6 db black-70'
const listItemLink = 'f6 link blue hover-dark-gray'
const democrat = 'blue'
const republican = 'red'
const other = 'green'

function memberList(props) {
	return html`<ul class=${list}>
		${props.members.map(function (member) {
			let icon = other
			if (member.party === 'R') {
				icon = republican
			}
			if (member.party === 'D') {
				icon = democrat
			}
			return html`<li class=${listItem}>
				<i class=${'fa fa-user fa-2x ' + icon}></i>
				<div class=${listItemTitleGroup}>
					<div class=${listItemTitle}>${member.name}</div>
					<div class=${listItemTitle}>${member.info}</div>
				</div>
				<div>
					<a class=${listItemLink} href=${member.link}>
						<i class='fa fa-2x fa-external-link'></i>
				</div>
			</li>`
		})}
	</ul>`
}

module.exports = memberList
