const express = require('express')
const parser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config();
const morgan = require('morgan') // <-- add this
const conController = require('./controllers/contractor.js')
const ownController = require('./controllers/owner.js')
const propController = require('./controllers/property.js')
const jobController = require('./controllers/job.js')
const indexController = require('./controllers/v2/index.js')
const v2Controller = require('./controllers/v2/index.js')
const userController = require('./controllers/users.js')
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.use(cors())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')) // <-- add this

    // app.get("/", (req, res) => {
    //     res.send("Welcome")
    // })
app.use('/api/',indexController)
app.use('/api/user', userController)
app.use('/api/contractor', conController)
app.use("/api/owner", ownController)
app.use("/api/property", propController)
app.use("/api/job", jobController)
app.use("/api/v2", v2Controller)


// app.get('/api', function(req, res) {
//     // res.redirect('/api/property')
//     res.send("Welcome to the API. Please refer to the documentation for usage details.")
// })

app.get('/', function(req, res) {
    res.redirect('/api')
})
app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
    console.log(`${app.get("port")} works`);
    console.log("http://localhost:8080/");
});