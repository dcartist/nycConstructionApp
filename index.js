const express = require('express')
const parser = require('body-parser')
const app = express()
const conController = require('./controllers/contractor')
    // const ownController = require('./controllers/owner')
    // const propController = require('./controllers/property')
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())


app.get("/", (req, res) => {
    res.send("Welcome")
})
app.use('/api/contractor', conController)
    // app.use("api/owner", ownController)
    // app.use("api/property", propController)
app.listen(4040, () => console.log("IT WORKS on 4040!!!!!!!!!!!!!!!"))