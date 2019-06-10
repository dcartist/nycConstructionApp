const mongoose = require('./connection')
const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const JobsFull = require('../models/JobsFull.js')
const Owner = require('../models/Owner.js')
const jobs = require('./jobsEdit.json')

JobsFull.deleteMany({}).then(() => {
    Owner.find({}).then(ownerInfo => {
            Contractor.find({}).then(contractInfo => {
                Property.find({}).then(propertyInfo => {
                    for (let index = 0; index < ownerInfo.length; index++) {
                        JobsFull.create({
                            owner: ownerInfo[index],
                            contractor: contractInfo[index],
                            property: propertyInfo[index],
                            jobId: index
                        }).then(full => {
                            console.log(full)
                        }).catch(err => { console.log(err) })
                    }
                })
            })

        }

    )
})