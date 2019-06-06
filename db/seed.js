const Property = require('../models/Property')
const jobs = require('./jobs')

Property.remove({})
Property.deleteMany({})
Property.collection.insert(jobs)
    .then(property => {
        console.log(property)
    })
    .catch(err => {
        console.log(err)
    })