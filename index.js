const express = require('express')
const parser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config();
const conController = require('./controllers/contractor.js')
const ownController = require('./controllers/owner.js')
const propController = require('./controllers/property.js')
const jobController = require('./controllers/job.js')
const userController = require('./controllers/users.js')
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.use(cors())
    // app.get("/", (req, res) => {
    //     res.send("Welcome")
    // })
app.use('/api/user', userController)
app.use('/api/contractor', conController)
app.use("/api/owner", ownController)
app.use("/api/property", propController)
app.use("/api/job", jobController)

app.get('/api', function(req, res) {
    res.redirect('/api/property')
})

app.get('/', function(req, res) {
    res.redirect('/api/property')
})
app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
    console.log(`${app.get("port")} works`);
});