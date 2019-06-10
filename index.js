const express = require('express')
const parser = require('body-parser')
const app = express()
const conController = require('./controllers/contractor.js')
const ownController = require('./controllers/owner.js')
const propController = require('./controllers/property.js')
const jobController = require('./controllers/job.js')
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())


app.get("/", (req, res) => {
    res.send("Welcome")
})
app.use('/api/contractor', conController)
app.use("/api/owner", ownController)
app.use("/api/property", propController)
app.use("/api/job", jobController)

app.set("port", process.env.PORT || 4040);
app.listen(app.get("port"), () => {
    console.log(`PORT: ${app.get("port")} works`)
})