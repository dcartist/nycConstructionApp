const express = require("express");
const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const JobsFull = require('../models/JobsFull')
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
                        }).then(full => {
                            console.log(full)
                        }).catch(err => { console.log(err) })
                    }
                })
            })

        }

    )
})