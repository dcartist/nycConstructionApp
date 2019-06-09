let jsitems = require('./db/jobsEdit.json')
const fs = require('fs');
// console.log(jsitems)
let count = 0
jsitems.forEach(element => {
    element.jobId = count
    count++
});

console.log(jsitems)

var info = JSON.stringify(jsitems)
fs.writeFile('./db/jobsEdit.json', info, function(err) {
    // if (err) throw err;
    // console.log('Saved!');
});