const express = require("express");
const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const JobsFull = require('../models/jobsFull')
const Owner = require('../models/Owner')
const jobs = require('./jobsEdit')

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
                                // owner_id: ownerInfo[index]._id,
                                // contractor_id: contractInfo[index]._id,
                                // property_id: propertyInfo[index]._id,
                                // jobId: index
                        }).then(full => {
                            console.log(full)
                        }).catch(err => { console.log(err) })
                    }
                })
            })

        }

    )
})


// console.log(own.tree)