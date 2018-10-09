const User = require('../models/users')
const { encrypt } = require('../helpers')
const jwt  = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const {OAuth2Client} = require('google-auth-library')
const axios = require('axios')

class Controller {
    static signup(req,res){
        if(req.body.password.length < 8){
            res.status(500).json({
                message : "password length is less than 8"
            })
        }

        encrypt(req.body.email, req.body.password)
        .then(function(encryptedPassword) {
            let newUser = new User({
                name:  req.body.name,
                gender: req.body.gender,
                phoneNumber: req.body.phone,
                address : req.body.address,
                email:   req.body.email,
                password: encryptedPassword,
                isOauth: false
            })
            return newUser
        })
        .then(function(newUser) {
            newUser.save()

            res.status(200).json({
                message : 'Signup Success'
            })

        })
        .catch(function(err){
           console.log(err)
           res.status(500).json({
               error : err.errors
           })
        })
    }

    static signin(req,res){
        
        User.findOne({
            email : req.body.email
        })
        .then(function(dataUser){
            
            let decrypt = bcrypt.compareSync(req.body.password, dataUser.password); // true

            if(decrypt == true){
                let token = jwt.sign({
                    userId : dataUser._id,
                    name : dataUser.name,
                    email : dataUser.email
                }, process.env.SECRET_KEY)

                res.status(200).json({
                    userId : dataUser._id,
                    name : dataUser.name,
                    email : dataUser.email,
                    token : token
                })
            }else{
                res.status(500).json({
                    message : 'Invalid password'
                })
            }
        })
        .catch(function(){
            res.status(500).json({
                message : `Invalid username`
            })
        })
    }

    static signinGoogle(req,res){
        let token = req.headers.token
        let CLIENT_ID = process.env.clientid
        const client = new OAuth2Client(CLIENT_ID);
        async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub']
        }
        // console.log('sebelum axios..')
        axios({
            method:'GET',
            url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}'`
        })
        .then(function(result) {
            // console.log('response === ',result)
            const dataR = result
            // console.log(dataR)
            User.findOne(
                { email: result.data.email 
            }).then(function(data){
                // console.log('dataaaaaaa=========',data)
                if(data){
                    // console.log('masuk ke data tidak sama dengan null')
                    // console.log(typeof data)
                    
                    let token = jwt.sign({
                        userId : data._id,
                        name : data.name,
                        email : data.email
                    }, process.env.SECRET_KEY)
                    
                    res.status(200).json({
                        userId : data._id,
                        name : data.name,
                        email : data.email,
                        token : token
                    })
                    
                } else {
                    
                    let newLogin = new User({
                        name: dataR.data.name,
                        gender : 'login with oauth',
                        address : 'login with oauth',
                        phoneNumber: 'login with oauth',
                        email: dataR.data.email,
                        password: null,
                        isOauth: true
                    })
                    
                    newLogin.save()

                    let token = jwt.sign({
                        userId : newLogin._id,
                        name : newLogin.name,
                        email : newLogin.email
                    }, process.env.SECRET_KEY)
    
                    res.status(200).json({
                        userId : dataUser._id,
                        name : dataUser.name,
                        email : dataUser.email,
                        token : token
                    })
                }
            })
        })
        .catch(function(err){
            console.log(err)
        })
        verify().catch(console.error);
    }
}

module.exports = Controller;