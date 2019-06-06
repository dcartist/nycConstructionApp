const express = require('express')
const parser = require('body-parser')
const app = express()
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.get("/", (req, res) => {
    res.send("Welcome")
})
app.listen(4040, () => console.log("IT WORKS on 4040!!!!!!!!!!!!!!!"))