const xhr = require('xhr')
const _ = require('lodash/fp')

module.exports = {
	namespace: 'members',
	state: {
		house: [],
		senate: []
	},
	reducers: {
		getMembers: function (state, data) {
			return _.set(data.chamber, data.members, state)
		}
	},
	effects: {
		fetchMembers: function (state, data, send, done) {
			const config = {
				url: `/api/congress/members/${data.chamber}`,
				json: true,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					done(err)
				}
				const payload = {
					chamber: data.chamber,
					members: body.members
				}
				send('members:getMembers', payload, done)
			})
		}
	}
}
