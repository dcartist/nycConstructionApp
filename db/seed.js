const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const Owner = require('../models/Owner')
const jobs = require('./jobs')

// .catch(err => {
//     console.log(err)
//         // process.exit()
// })

Property.deleteMany({}).then(
    Property.insertMany(jobs).then(property => {
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

Contractor.deleteMany({}).then(
    // Contractor.create(jobs) 
    Contractor.insertMany(jobs)
    .then(contractor => {
        console.log(contractor)
    }).catch(err => { console.log(err) })
)
Owner.deleteMany({}).then(
        // Contractor.create(jobs) 
        Owner.insertMany(jobs)
        .then(owner => {
            console.log(owner)
            process.exit()
        }).catch(err => { console.log(err) })
    )
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