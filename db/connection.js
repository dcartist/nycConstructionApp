const mongoose = require('mongoose')
mongoose.Promise = Promise
let mongoURI = "";
if (process.env.NODE_ENV === "production") {
    mongoURI = process.env.DB_URL;
} else {
    mongoURI = "mongodb://localhost/nycjobappv2";
    // mongoURI = process.env.DB_URL;
    // mongoURI = "mongodb://localhost/nycjobapp";
}
mongoose
    .connect(mongoURI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000,
        socketTimeoutMS: 65000 
     })
    .then(instance => console.log(`Connected to db: ${instance.connections[0].name}`)) //instance is what the database that your are connected to
    .catch(error => console.log('Connection failed!', error))

module.exports = mongoose