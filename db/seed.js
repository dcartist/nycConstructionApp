const Property = require('../models/Property')
const jobs = require('./jobs')

Property.remove({}).then(
    Property.create(jobs).then(property => {
        console.log(property)
    }).catch(err => {
        console.log(err)
            // process.exit()
    })
).then(
    Property.aggregate(
        [
            { '$project': { 'address': { '$concat': ["$propNum", " ", "$street_name"] } } }
        ]
    ))

// Property.deleteMany({})
/* 
Property.collection.insert(jobs)
    .then(property => {
        console.log(property)
        process.exit()
    })
    .catch(err => {
        console.log(err)
        process.exit()
    }) */