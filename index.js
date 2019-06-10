const express = require('express')
const parser = require('body-parser')
const app = express()
const cors = require('cors')
const conController = require('./controllers/contractor.js')
const ownController = require('./controllers/owner.js')
const propController = require('./controllers/property.js')
const jobController = require('./controllers/job.js')
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.use(cors())

// app.get("/", (req, res) => {
//     res.send("Welcome")
// })
app.use('/api/contractor', conController)
app.use("/api/owner", ownController)
app.use("/api/property", propController)
app.use("/api/job", jobController)
app.get('/', (req, res) => {
        res.redirect('/api/job')
    })
    // app.set("port", process.env.PORT || 8000);
    // app.listen(app.get("port"), () => {
    //     console.log(`PORT: ${app.get("port")} works`)
    // })
const port = process.env.PORT || 8000;

app.set("port", process.env.PORT || 3000);
app.listen(port, () => {
    console.log("App is running on port " + port);
});

// app.listen(app.get("port"), () => {
//     console.log(`PORT: ${app.get("port")}`);
// });