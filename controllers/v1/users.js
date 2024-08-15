const express = require('express')
const router = express.Router()
//bringing in JWT(JSON Web Token) encode and decode module for node.js.
//jwt-simple
// By default the algorithm to encode is HS256.
// The supported algorithms for encoding and decoding are HS256, HS384, HS512 and RS256.
const jwt = require('jwt-simple')

//this links the files together
const passport = require('../../config/passport')
const config = require('../../config/config')
const mongoose = require('../models/User')
const User = mongoose.model('User')

router.post('/signup', (req, res) => {
    if (req.body.email && req.body.password) {
      let newUser = {
        email: req.body.email,
        password: req.body.password
      }
      User.findOne({ email: req.body.email })
        .then((user) => {
          if (!user) {
            User.create(newUser)
              .then(user => {
                if (user) {
                  var payload = {
                    id: newUser.id
                  }
                  var token = jwt.encode(payload, config.jwtSecret)
                  res.json({
                    token: token
                  })
                } else {
                  res.sendStatus(401)
                }
              })
          } else {
            res.sendStatus(401)
          }
        })
    } else {
      res.sendStatus(401)
    }
  })
  




module.exports = router