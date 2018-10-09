const User = require('../models/users')
const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')

class Middleware {
    static authenticate(req, res, next) {
        let token = req.headers.token
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
                if (!err) {
                    User.findById(decoded.userId)
                        .then(function (user) {
                            req.id = user._id
                            next()
                        })
                } else {
                    res.status(403).json({
                        message: 'invalid token'
                    })
                }
            })
        } else {
            console.log('token not found')
            res.status(403).json({
                message: 'token not found'
            })
        }
    }

    static isHim(req, res, next) {
        let token = req.headers.token
        let check = false
        // console.log('ini req params id nyaaaa',req.params.id)
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
                if (!err) {
                    User.findById(decoded.userId)
                        .then(function (user) {
                            for(let i = 0 ; i < user.todoList.length ; i ++){
                                if(req.params.id === user.todoList[i]){
                                    check = true
                                }
                            }

                            if(check = true){
                                next()
                            }
                        })
                } else {
                    res.status(403).json({
                        message: 'invalid token'
                    })
                }
            })
        } else {
            console.log('token not found')
            res.status(403).json({
                message: 'token not found'
            })
        }
        
    }
}

module.exports = Middleware;