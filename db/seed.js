const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const Owner = require('../models/Owner')
const jobs = require('./jobsEdit')
    // const collectionNames = ["Property", "Contractor", "Owner"]
    // .catch(err => {
    //     console.log(err)
    //         // process.exit()
    //
    /*     Property.insertMany(jobs).then(property => {
            console.log(property)
        }).catch(err => {
            console.log(err)
                // process.exit()
        })
     */

function dbRun() {
    //begin of function
    Property.deleteMany({}).then(
        Contractor.deleteMany({}).then(
            Owner.deleteMany({}).then(
                deleted => {
                    console.log("deleted DB")
                }
            )
        )
    ).then(
        Property.insertMany(jobs).then(property => {
            console.log(property)
        }).then(Contractor.insertMany(jobs).then(contractor => {
            // console.log(contractor)
            console.log("Contractors done")
        })).then(
            Owner.insertMany(jobs).then(owner => { //same as fetch

            }).catch(err => { console.log(err) })
        )

    )

    /* 
        Contractor.deleteMany({}).then(
                // Contractor.create(jobs) 
                Contractor.insertMany(jobs)
                .then(contractor => {
                    // console.log(contractor)
                }).catch(err => { console.log(err) })) // End of Contractor
        Owner.deleteMany({}).then(
                // Contractor.create(jobs) 
                Owner.insertMany(jobs)
                .then(owner => {
                    // console.log(owner)
                    process.exit()
                }).catch(err => { console.log(err) })) // End of the Owner */
    /* function dbRun() {
        //begin of function
        Property.deleteMany({}).then(
            Property.insertMany(jobs).then(property => {
                console.log(property)
            }).catch(err => {
                console.log(err)
                    // process.exit()
            })
        ).then()
        Contractor.deleteMany({}).then(
                // Contractor.create(jobs) 
                Contractor.insertMany(jobs)
                .then(contractor => {
                    // console.log(contractor)
                }).catch(err => { console.log(err) })) // End of Contractor
        Owner.deleteMany({}).then(
                // Contractor.create(jobs) 
                Owner.insertMany(jobs)
                .then(owner => {
                    // console.log(owner)
                    process.exit()
                }).catch(err => { console.log(err) })) // End of the Owner */
    /* 
        for (i = 0; i < collectionNames.length; i++) {
            recordChecker(collectionNames[i])
        }
     */

    //end of function
}
//function that checks to see if the records are in the database
function recordChecker(x) {
    x.find({}, (err, doc) => {
        if (doc.length) {
            process.exit() //if it has data in it, then exit out of the seeding file
        } else {
            dbRun() // run dbRun again
        }
    })
}
/* 
function rundb() {
    for (i = 0; i < 2; i++) {
        dbRun()
    }
}
rundb() */
dbRun()
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