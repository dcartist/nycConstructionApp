const mongoose = require('../connection')
const Property = new mongoose.Schema({
    borough: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    street_name: {
        type: String,
        trim: true
    },
    propNum: {
        type: String,
        trim: true
    },
    propType: {
        type: String,
        trim: true
    },
    jobDescr: {
        type: String,
        trim: true
    }


})

let property = mongoose.model('Property', Property)
    //was checking into using virtual...
    // Property.virtual('address.full').get(function() {
    //     return this.name.first + ' ' + this.name.last;
    // });


module.exports = property

/* "borough"
"address"
"city"
"zip"
"propType"
 “jobDescr” 
 */