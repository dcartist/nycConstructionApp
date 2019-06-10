const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Owner = require('../models/Owner.js')
const jobsedit = require('./jobsEdit.json')


function createdb() {
    Contractor.insertMany(jobsedit).then(cont => {
        console.log('contractor');

        // });
    })
    Property.insertMany(jobsedit).then(prop => {
            console.log('property')
        })
        .then(
            Owner.insertMany(jobsedit).then(own => {
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