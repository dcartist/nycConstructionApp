const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const Owner = require('../models/Owner')
const jobs = require('./jobsEdit')

function createdb() {
    Contractor.insertMany(jobs).then(owner => {
        console.log(contractor);

        // });
    })
    Property.insertMany(jobs).then(property => {
            console.log(property)
        })
        .then(
            Owner.insertMany(jobs).then(owner => {
                console.log(owner);
            })
        ).then( //End of the inserting

        ).catch(err => { console.log(err) })

}

function dbRun() {
    //begin of function
    Property.deleteMany({}).then(
        Contractor.deleteMany({}).then(
            Owner.deleteMany({}).then(
                deleted => {
                    console.log("deleted DB & Adding info")
                    createdb()
                }
            )
        ) //finish deleting the database
    ).then()

    //end of function
}

dbRun()