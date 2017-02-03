const xhr = require('xhr')

module.exports = {
	namespace: 'home',
	state: {
		message: 'Hello Choo'
	},
	reducers: {
		UPDATE_MESSAGE: function (state, data) {
			return Object.assign({}, state, {message: data.message})
		}
	},
	effects: {
		SEND_MESSAGE: function (state, data, send, done) {
			const config = {
				url: '/api/message',
				json: true,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			xhr.get(config, function (err, resp, body) {
				if (err) {
					done(err)
				}
				send('home:UPDATE_MESSAGE', body, done)
			})
		}
	}
}
