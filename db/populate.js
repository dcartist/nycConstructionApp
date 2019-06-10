const Property = require('../models/Property.js')
const Contractor = require('../models/Contractor.js')
const Jobsfull = require('../models/Jobsfull.js')
const Owner = require('../models/Owner.js')

Jobsfull.deleteMany({}).then(() => {
    Owner.find({}).then(ownerInfo => {
            Contractor.find({}).then(contractInfo => {
                Property.find({}).then(propertyInfo => {
                    for (let index = 0; index < ownerInfo.length; index++) {
                        Jobsfull.create({
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