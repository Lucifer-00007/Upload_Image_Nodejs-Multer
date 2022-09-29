var crypt = require('crypto')

var randomString = crypt.randomBytes(32).toString('hex');

console.log('randomString>>',randomString)
