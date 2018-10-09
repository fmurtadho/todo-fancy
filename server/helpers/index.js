const bcrypt = require('bcrypt')

module.exports = {
    encrypt: function (password) {
        return new Promise(function (resolve, reject) {
            const saltRound = 10
            bcrypt.genSalt(saltRound, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (!err) {
                        resolve(hash)
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }
}