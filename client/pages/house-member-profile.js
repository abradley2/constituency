const html = require('choo/html')

function homeMemberProfile(state, prev, send) {
	function getMemberInfo() {
		send('members:getMemberInfo', {memberId: state.location.params.memberId})
	}

	return html`<h3 onload=${getMemberInfo}>
		Member
	</h3>`
}

module.exports = homeMemberProfile
