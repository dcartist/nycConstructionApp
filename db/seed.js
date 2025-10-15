const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobs = require('../models/Jobs.js')
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

        )
        // .catch(err => { console.log(err) })

        //find all the jobId from Contractor and Property and Owner and make a job for each one
        .then(async () => {

             const contractor = await Contractor.find()
             const property = await Property.find()
             const owner = await Owner.find()

contractor.forEach((con, index) => {
    console.log(con)
    const prop = property[index];
    const own = owner[index];

    if (con && prop && own) {
        const newJob = new Jobs({
            jobId: index + 1,
            contractor: con._id,
            property: prop._id,
            owner: own._id
        });
        console.log(newJob);
        newJob.save()
            .then(savedJob => {
                console.log(`Saved job ${savedJob.jobId}`);
                console.log(savedJob)
                // console.log(`Contractor: ${con._id}, Property: ${prop._id}, Owner: ${own._id}`);
            })
            .catch(err => {
                console.log(`Error saving job ${index + 1}: ${err}`);
            });




           }

        });
        //End of the then   
// process.exit()
})
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