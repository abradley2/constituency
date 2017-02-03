const message = {
	get: function (req, res, ctx, done) {
		return done(null, {message: 'Hello from Merry'})
	}
}

module.exports = message
