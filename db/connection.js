const mongoose = require('mongoose')
mongoose.Promise = Promise

const mongoURI = process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : "mongodb://localhost/nycjobapp";

// Cache the connection across serverless invocations
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            }).then(instance => {
            console.log(`Connected to db: ${instance.connections[0].name}`);
            return instance;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

connectDB().catch(error => console.log('Connection failed!', error));

module.exports = mongoose;
module.exports.connectDB = connectDB;
