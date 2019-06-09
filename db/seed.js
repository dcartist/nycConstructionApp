const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const Owner = require('../models/Owner')
const jobs = require('./jobsEdit')


function createdb() {
    Contractor.insertMany(jobs).then(cont => {
        console.log('contractor');

        // });
    })
    Property.insertMany(jobs).then(prop => {
            console.log('property')
        })
        .then(
            Owner.insertMany(jobs).then(own => {
                console.log('owner');

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