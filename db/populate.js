const express = require("express");
const Property = require('../models/Property')
const Contractor = require('../models/Contractor')
const Owner = require('../models/Owner')
const jobs = require('./jobsEdit')
let propInfo1
let ownInfo1
let conInfo1
    // Property.findByIdAndUpdate({},)
Property.find({}).then(propInfo => {
        Owner.find({}).then(ownInfo => {
            // Contractor.find({}).then(conInfo => {
            //         // console.log(typeof checked)
            //         console.log(propInfo[0])
            //         console.log(ownInfo[0])
            //         console.log(conInfo[0])
            //         console.log(jobs[0].address)
            //         console.log(jobs[0].conFirstName)
            //         console.log(jobs[0].ownFirstName)
            //             // propInfo1 = propInfo[0]
            //         process.exit()
            //     }
            // )
            Contractor.findOneAndUpdate()
        })
    })
    // console.log(propInfo[0])
    // Property.find({}).then(propInfo => {
    //     Owner.find({}).then(ownInfo => {
    //             Contractor.find({}).then(conInfo => {
    //                     // console.log(typeof checked)
    //                     console.log(propInfo[0])
    //                     console.log(ownInfo[0])
    //                     console.log(conInfo[0])
    //                     process.exit()
    //                 }

//             )
//         }

//     )
// })