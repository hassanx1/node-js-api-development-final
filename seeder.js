const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env vars
dotenv.config({
    path: './config/config.env'
});

// load models
const Bootcamp = require('./models/Bootcamp');

//connect to mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

// read the json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data imported...')
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// delete into db
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();

        console.log('Data deleted...')
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {
    importData();

} else if (process.argv[2] === '-d') {
    deleteData();
}