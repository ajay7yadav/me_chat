const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DATABASE Connected");
}).catch((err) => {
    console.log("Error While Connect DATABASE ", err.message);
})

require('./routes/user.route.js')(app);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on Port ${process.env.PORT}`);
})