const path = require('path')
const memdb = require('memdb')
const level = require('level')

const opts = {valueEncoding: 'json'}

const leveldb = level(path.join(__dirname, '../../_leveldb'), opts)

module.exports = process.env.NODE_ENV === 'development' ? memdb(opts) : leveldb
