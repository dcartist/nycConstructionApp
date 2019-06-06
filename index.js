const express = require('express')
const parser = require('body-parser')

const app = express()

app.get("/", (req, res) => {
    res.send("Welcome")
})

app.listen(4040, () => console.log("IT WORKS on 4040!!!!!!!!!!!!!!!"))